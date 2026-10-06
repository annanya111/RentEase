import { NextResponse } from 'next/server';
import { updateBookingStatus } from '@/lib/db';

export async function PATCH(request, { params }) {
  try {
    const body = await request.json();
    const updated = await updateBookingStatus(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
