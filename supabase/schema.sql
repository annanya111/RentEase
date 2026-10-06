-- ====================================================================
-- RentEase Equipment Rental Marketplace — PostgreSQL / Supabase Schema
-- ====================================================================

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price_per_day NUMERIC(10, 2) NOT NULL,
    deposit NUMERIC(10, 2) NOT NULL DEFAULT 100.00,
    total_stock INTEGER NOT NULL DEFAULT 1,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    image TEXT NOT NULL,
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    specs JSONB DEFAULT '{}'::jsonb,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    product_category TEXT NOT NULL,
    product_image TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    customer_address TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days INTEGER NOT NULL DEFAULT 1,
    price_per_day NUMERIC(10, 2) NOT NULL,
    rental_subtotal NUMERIC(10, 2) NOT NULL,
    deposit NUMERIC(10, 2) NOT NULL,
    service_fee NUMERIC(10, 2) NOT NULL DEFAULT 10.00,
    total NUMERIC(10, 2) NOT NULL,
    delivery_method TEXT NOT NULL DEFAULT 'Doorstep Delivery',
    status TEXT NOT NULL DEFAULT 'Confirmed',
    payment_status TEXT NOT NULL DEFAULT 'Paid (Card)',
    notes TEXT,
    cancellation_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Indexes for fast availability searches and customer lookups
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_bookings_product_dates ON public.bookings(product_id, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_email ON public.bookings(customer_email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Products: Read-accessible to public; Insert/Update/Delete open for service role or admin
CREATE POLICY "Public products view" 
    ON public.products FOR SELECT 
    USING (true);

CREATE POLICY "Public products modify" 
    ON public.products FOR ALL 
    USING (true);

-- Bookings: Customers can read and create reservations
CREATE POLICY "Public bookings view" 
    ON public.bookings FOR SELECT 
    USING (true);

CREATE POLICY "Public bookings insert" 
    ON public.bookings FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Public bookings modify" 
    ON public.bookings FOR UPDATE 
    USING (true);

-- 6. Seed Realistic Fleet Inventory
INSERT INTO public.products (id, name, category, price_per_day, deposit, total_stock, rating, review_count, image, description, features, specs, is_available)
VALUES
('prod-1', 'Sony PlayStation 5 Digital Edition (Slim)', 'Gaming Consoles', 24.00, 150.00, 4, 4.90, 42, 
 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=900&q=80',
 'Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with haptic feedback, adaptive triggers, and 3D Audio.',
 '["2x DualSense Wireless Controllers included", "1TB ultra-fast internal NVMe SSD", "Includes HDMI 2.1 cable & power adapter", "Preloaded with top party games"]'::jsonb,
 '{"Resolution": "Up to 4K 120Hz / 8K support", "Storage": "1TB SSD", "Weight": "2.6 kg", "Connectivity": "Wi-Fi 6, Gigabit Ethernet, Bluetooth 5.1"}'::jsonb,
 true),

('prod-2', 'Sony Alpha A7 IV Mirrorless Camera Body', 'Cameras', 48.00, 350.00, 3, 4.95, 68,
 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
 '33MP full-frame Exmor R sensor with advanced AF, 4K 60p 10-bit 4:2:2 video, and 759-point phase detection. Ideal for commercial shoots, events, and cinematic video.',
 '["Includes 2x NP-FZ100 batteries & dual charger", "SanDisk Extreme Pro 128GB V90 SD card included", "Padded peak design camera shoulder strap", "Rugged weather-sealed protective carry case"]'::jsonb,
 '{"Sensor": "33MP Full-Frame Exmor R CMOS", "Video": "4K 60p, 10-bit 4:2:2 All-Intra", "Lens Mount": "Sony E-mount", "Stabilization": "5-axis In-body Sensor-shift"}'::jsonb,
 true),

('prod-3', 'DJI Mini 4 Pro Fly More Combo', 'Travel Gear', 36.00, 220.00, 3, 4.88, 35,
 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=900&q=80',
 'Sub-249g ultra-light folding drone with omnidirectional obstacle sensing, 4K/60fps HDR true vertical shooting, and up to 34 minutes flight time per battery.',
 '["DJI RC 2 remote with built-in high-brightness screen", "3x Intelligent Flight Batteries with charging hub", "ND filter set (ND16/64/256) & spare propellers", "Compact travel shoulder bag"]'::jsonb,
 '{"Weight": "Under 249 g (No FAA permit needed in many zones)", "Range": "Up to 20 km FHD transmission", "Camera": "4K/60fps HDR, 48MP Stills", "Obstacle Avoidance": "Omnidirectional active sensors"}'::jsonb,
 true),

('prod-4', 'Meta Quest 3 VR Headset (512GB)', 'VR Equipment', 32.00, 200.00, 4, 4.92, 51,
 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=900&q=80',
 'Breakthrough mixed reality headset with 4K+ Infinite Display, pancake lenses for crystal-clear optics, and full-color passthrough for gaming and spatial productivity.',
 '["Includes 2x Touch Plus controllers with active straps", "Elite Comfort headstrap with extra battery support", "Sanitized silicone facial interface & lens protector", "Fast 45W USB-C charging block and braided cable"]'::jsonb,
 '{"Display": "2064x2208 pixels per eye, 120Hz refresh", "Storage": "512 GB onboard", "Passthrough": "Dual RGB 18 PPD high-res cameras", "Audio": "Integrated 3D spatial audio speakers"}'::jsonb,
 true),

('prod-5', 'Anker Nebula Capsule 3 Laser 1080p Projector', 'Projectors', 26.00, 180.00, 3, 4.85, 29,
 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80',
 'Soda-can sized laser projector packing 300 ANSI lumens, native 1080p crisp laser clarity, Android TV 11.0, and 2.5 hours of wire-free playtime.',
 '["Autofocus & auto-keystone correction in 3 seconds", "Built-in 8W Dolby Digital speaker", "Compact aluminum mini-tripod included", "Protective hardshell carry case & remote"]'::jsonb,
 '{"Brightness": "300 ANSI Lumens Laser Engine", "Max Screen": "Up to 120 inches", "Battery": "Built-in 52Wh (approx. 2.5 hours)", "Inputs": "HDMI 2.0, USB-C, Bluetooth 5.0, Wi-Fi"}'::jsonb,
 true),

('prod-6', 'Canon EOS R6 Mark II + RF 24-70mm f/2.8L', 'Cameras', 65.00, 450.00, 2, 4.97, 38,
 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=900&q=80',
 'Pro-grade hybrid creator kit: 24.2MP full-frame sensor, up to 40 fps electronic shutter, 6K oversampled 4K 60p, paired with the legendary RF 24-70mm f/2.8L IS USM.',
 '["Canon RF 24-70mm f/2.8L IS USM lens included", "2x LP-E6NH batteries and dual USB charger", "Peak Design carbon travel tripod included on request", "Heavy duty Pelican storm flight case"]'::jsonb,
 '{"Sensor": "24.2MP Full-Frame Dual Pixel CMOS AF II", "Continuous Shooting": "Up to 40 fps", "Video": "4K 60p uncropped 6K oversampled", "Lens": "24-70mm f/2.8 constant aperture"}'::jsonb,
 true),

('prod-7', 'Nintendo Switch OLED Edition (White)', 'Gaming Consoles', 18.00, 120.00, 5, 4.89, 74,
 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=900&q=80',
 'Vibrant 7-inch OLED screen, wide adjustable stand, dock with wired LAN port, 64 GB of internal storage, and enhanced audio for handheld or docked party gaming.',
 '["4x Joy-Con controllers for 4-player multiplayer", "Dock, HDMI cable, and power adapter", "Carry case with 10 game cartridge slots", "Preloaded with Mario Kart 8 & Super Smash Bros"]'::jsonb,
 '{"Screen": "7-inch OLED 720p handheld / 1080p docked", "Storage": "64GB internal + 256GB microSD card", "Battery": "4.5 to 9 hours", "Weight": "Approx. 420 g with Joy-Cons"}'::jsonb,
 true),

('prod-8', 'Osprey Farpoint 55 Travel Pack & Gear Kit', 'Travel Gear', 14.00, 90.00, 6, 4.82, 26,
 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
 'The ultimate world-travel backpack system. Features a 40L main pack with stowable harness plus a zip-off 15L daypack for excursions and airline carry-on compatibility.',
 '["Detachable 15L daypack with laptop/tablet sleeve", "LightWire peripheral frame suspension", "Includes set of 4 waterproof compression cubes", "TSA-approved combination cable lock included"]'::jsonb,
 '{"Capacity": "55 Liters total (40L chassis + 15L daypack)", "Dimensions": "55H x 35W x 23D cm", "Weight": "1.92 kg", "Fit": "Adjustable torso suspension (M/L)"}'::jsonb,
 true)
ON CONFLICT (id) DO NOTHING;

-- 7. Seed Initial Reservations
INSERT INTO public.bookings (id, product_id, product_name, product_category, product_image, customer_name, customer_email, customer_phone, customer_address, start_date, end_date, days, price_per_day, rental_subtotal, deposit, service_fee, total, delivery_method, status, payment_status, notes)
VALUES
('RE-2026-8419', 'prod-1', 'Sony PlayStation 5 Digital Edition (Slim)', 'Gaming Consoles',
 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=900&q=80',
 'Alex Mercer', 'alex.mercer@example.com', '+1 (555) 234-8901', '422 Willow Creek Rd, Seattle, WA',
 '2026-10-08', '2026-10-12', 4, 24.00, 96.00, 150.00, 12.00, 258.00,
 'Doorstep Delivery', 'Confirmed', 'Paid (Card)', 'Delivering before 2 PM. Please test both DualSense controllers.')
ON CONFLICT (id) DO NOTHING;
