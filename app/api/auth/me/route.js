import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const { user, profile, role } = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ user: null, profile: null, role: null });
    }
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: profile?.name || user.user_metadata?.name || user.email?.split('@')[0],
      },
      profile,
      role,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
