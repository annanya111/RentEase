import { NextResponse } from 'next/server';
import { cancelBooking } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function POST(request, { params }) {
  try {
    const { errorResponse, user, profile, role } = await requireAuth(request);
    if (errorResponse) return errorResponse;

    const body = await request.json().catch(() => ({}));
    const result = await cancelBooking(params.id, body.reason, { user, profile, role });
    return NextResponse.json(result);
  } catch (error) {
    const status = error.status || 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
