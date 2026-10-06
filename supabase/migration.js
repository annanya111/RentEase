const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.yfqnsughivdotulupzou:5VRMthCDihkwG0cQ@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';
const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

const migrationSQL = `
-- 1. Create profiles table linked to auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer', 'seller', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add owner_id to products if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'owner_id'
    ) THEN
        ALTER TABLE public.products ADD COLUMN owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 3. Add customer_id to bookings if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'customer_id'
    ) THEN
        ALTER TABLE public.bookings ADD COLUMN customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 4. Create trigger to automatically insert a profile for every new auth user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE(
            CASE 
                WHEN NEW.raw_user_meta_data->>'role' = 'seller' THEN 'seller'
                ELSE 'buyer'
            END,
            'buyer'
        )
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        name = COALESCE(EXCLUDED.name, profiles.name),
        email = COALESCE(EXCLUDED.email, profiles.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Backfill existing auth.users into profiles if any exist
INSERT INTO public.profiles (id, name, email, role)
SELECT 
    id,
    COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)),
    email,
    'buyer'
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 6. Grant permissions to Supabase roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;

-- 7. Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles view" ON public.profiles;
CREATE POLICY "Public profiles view" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Service role full access on profiles" ON public.profiles;
CREATE POLICY "Service role full access on profiles" ON public.profiles FOR ALL USING (true);
`;

async function run() {
  await client.connect();
  console.log('Connected to PostgreSQL...');
  await client.query(migrationSQL);
  console.log('Migration executed successfully!');

  const tables = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
  console.log('Tables in public schema:', tables.rows.map(x => x.table_name));

  const profileCols = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='profiles'");
  console.log('Profiles columns:', profileCols.rows);

  const productCols = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='products' AND column_name='owner_id'");
  console.log('Products owner_id column:', productCols.rows);

  const bookingCols = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='bookings' AND column_name='customer_id'");
  console.log('Bookings customer_id column:', bookingCols.rows);

  await client.end();
}

run().catch(e => {
  console.error('Migration error:', e);
  process.exit(1);
});
