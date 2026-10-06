import { NextResponse } from 'next/server';
import { getBookings, createBooking } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      email: searchParams.get('email') || undefined,
      phone: searchParams.get('phone') || undefined,
      search: searchParams.get('search') || undefined,
      status: searchParams.get('status') || undefined,
    };

    const bookings = await getBookings(filters);
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('API /api/bookings GET error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { productId, startDate, endDate, customer } = body;

    if (!productId || !startDate || !endDate || !customer || !customer.name || !customer.email) {
      return NextResponse.json(
        { error: 'Missing required booking details (productId, start/end dates, customer name & email)' },
        { status: 400 }
      );
    }

    const created = await createBooking(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('API /api/bookings POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create booking' }, { status: 400 });
  }
}
