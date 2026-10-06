import { NextResponse } from 'next/server';
import { getBookings, createBooking } from '@/lib/db';
import { getCurrentUser, requireAuth } from '@/lib/auth';

export async function GET(request) {
  try {
    const { user, profile, role } = await getCurrentUser(request);

    // If not logged in, reject access to bookings
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in to view your bookings.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;

    let filters = { search, status };

    if (role === 'admin') {
      // Admin can see all bookings
      const email = searchParams.get('email') || undefined;
      const phone = searchParams.get('phone') || undefined;
      filters = { ...filters, email, phone };
    } else if (role === 'seller') {
      // Seller sees bookings for their own items, or their own rentals
      const viewAs = searchParams.get('view') || 'seller'; // 'seller' for gear booked, 'buyer' for my own rentals
      if (viewAs === 'buyer') {
        filters.customerId = user.id;
      } else {
        filters.sellerOwnerId = user.id;
      }
    } else {
      // Buyer can ONLY see their own bookings
      filters.customerId = user.id;
    }

    const bookings = await getBookings(filters);
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('API /api/bookings GET error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // 1. Strictly verify authenticated user
    const { errorResponse, user, profile } = await requireAuth(request);
    if (errorResponse) {
      return errorResponse;
    }

    const body = await request.json();
    const { productId, startDate, endDate, deliveryMethod, notes } = body;

    if (!productId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required rental parameters (productId, startDate, endDate)' },
        { status: 400 }
      );
    }

    // Customer details from authenticated session, with optional overrides from body
    const customer = {
      name: body.customer?.name || profile?.name || user.email?.split('@')[0] || 'Customer',
      email: user.email, // Always trust verified email from session
      phone: body.customer?.phone || 'N/A',
      address: body.customer?.address || (deliveryMethod === 'Store Pickup' ? 'Store Pickup' : 'Standard Address'),
    };

    // Customer ID is ALWAYS bound to authenticated user ID
    const customerId = user.id;

    const created = await createBooking(
      {
        productId,
        startDate,
        endDate,
        customer,
        deliveryMethod,
        notes,
      },
      customerId
    );

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('API /api/bookings POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create booking' }, { status: 400 });
  }
}
