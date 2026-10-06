import { NextResponse } from 'next/server';
import { getServerSupabase, getAdminClient } from './supabase-server';

/**
 * Retrieves the currently authenticated Supabase user and their profile role.
 * Supports Next.js cookie sessions and Authorization Bearer headers.
 */
export async function getCurrentUser(request = null) {
  const adminClient = getAdminClient();
  let user = null;

  // 1. Check Authorization Bearer header first if present in request
  if (request) {
    const authHeader = request.headers.get('authorization') || '';
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      if (token && adminClient) {
        const { data, error } = await adminClient.auth.getUser(token);
        if (!error && data?.user) {
          user = data.user;
        }
      }
    }
  }

  // 2. If no user from header, check server cookie session
  if (!user) {
    const serverSupabase = getServerSupabase();
    if (serverSupabase) {
      try {
        const { data: { user: cookieUser }, error } = await serverSupabase.auth.getUser();
        if (!error && cookieUser) {
          user = cookieUser;
        }
      } catch (err) {
        // cookies context error or no session
      }
    }
  }

  if (!user) {
    return { user: null, profile: null, role: null };
  }

  // 3. Fetch user profile from public.profiles
  let profile = null;
  if (adminClient) {
    const { data, error } = await adminClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!error && data) {
      profile = data;
    } else {
      // Auto-create profile if missing
      const newProfile = {
        id: user.id,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        email: user.email,
        role: 'buyer',
      };
      const { data: created } = await adminClient.from('profiles').insert([newProfile]).select().single();
      profile = created || newProfile;
    }
  } else {
    // Local / fallback profile
    profile = {
      id: user.id,
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      email: user.email,
      role: user.user_metadata?.role || 'buyer',
    };
  }

  return {
    user,
    profile,
    role: profile?.role || 'buyer',
  };
}

/**
 * Server-side authorization check: user must be authenticated.
 * Returns { user, profile, role } or throws a 401 response error.
 */
export async function requireAuth(request) {
  const { user, profile, role } = await getCurrentUser(request);
  if (!user) {
    return {
      errorResponse: NextResponse.json(
        { error: 'Authentication required. Please log in to proceed.' },
        { status: 401 }
      ),
      user: null,
      profile: null,
      role: null,
    };
  }
  return { errorResponse: null, user, profile, role };
}

/**
 * Server-side authorization check: user must be seller or admin.
 */
export async function requireSeller(request) {
  const { errorResponse, user, profile, role } = await requireAuth(request);
  if (errorResponse) return { errorResponse, user: null, profile: null, role: null };

  if (role !== 'seller' && role !== 'admin') {
    return {
      errorResponse: NextResponse.json(
        { error: 'Forbidden: Seller or Admin privileges required.' },
        { status: 403 }
      ),
      user,
      profile,
      role,
    };
  }
  return { errorResponse: null, user, profile, role };
}

/**
 * Server-side authorization check: user must be admin.
 */
export async function requireAdmin(request) {
  const { errorResponse, user, profile, role } = await requireAuth(request);
  if (errorResponse) return { errorResponse, user: null, profile: null, role: null };

  if (role !== 'admin') {
    return {
      errorResponse: NextResponse.json(
        { error: 'Forbidden: Admin access only.' },
        { status: 403 }
      ),
      user,
      profile,
      role,
    };
  }
  return { errorResponse: null, user, profile, role };
}

/**
 * Upgrades an authenticated buyer to seller role.
 */
export async function upgradeToSeller(userId) {
  const adminClient = getAdminClient();
  if (adminClient) {
    const { data, error } = await adminClient
      .from('profiles')
      .update({ role: 'seller' })
      .eq('id', userId)
      .select()
      .single();
    if (!error && data) return data;
  }
  return { id: userId, role: 'seller' };
}
