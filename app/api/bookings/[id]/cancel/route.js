import { NextResponse } from 'next/server';
import { cancelBooking } from '@/lib/db';

export async function POST(request, { params }) {
  try {
    const body = await request.json().catch(() => ({}));
    const result = await cancelBooking(params.id, body.reason);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
