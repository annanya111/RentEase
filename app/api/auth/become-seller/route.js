import { NextResponse } from 'next/server';
import { requireAuth, upgradeToSeller } from '@/lib/auth';

export async function POST(request) {
  try {
    const { errorResponse, user, role } = await requireAuth(request);
    if (errorResponse) return errorResponse;

    if (role === 'admin') {
      return NextResponse.json({ message: 'User is already an admin', role: 'admin' });
    }

    const updated = await upgradeToSeller(user.id);
    return NextResponse.json({
      success: true,
      message: 'Your account has been upgraded to Seller. You can now list equipment in your Seller Dashboard.',
      profile: updated,
      role: 'seller',
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
