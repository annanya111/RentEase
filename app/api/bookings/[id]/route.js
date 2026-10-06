import { NextResponse } from 'next/server';
import { getBookingById } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const booking = await getBookingById(params.id);
    if (!booking) {
      return NextResponse.json({ error: `Booking ${params.id} not found` }, { status: 404 });
    }
    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
