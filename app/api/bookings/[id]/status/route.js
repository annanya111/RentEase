import { NextResponse } from 'next/server';
import { updateBookingStatus, getBookingById, getProductById } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function PATCH(request, { params }) {
  try {
    const { errorResponse, user, role } = await requireAuth(request);
    if (errorResponse) return errorResponse;

    const booking = await getBookingById(params.id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Role check: Only admin or the seller who owns the booked product can update status
    if (role !== 'admin') {
      const product = await getProductById(booking.productId);
      const isOwner = product && product.ownerId === user.id;
      if (!isOwner) {
        return NextResponse.json(
          { error: 'Forbidden: Only the equipment owner or platform admin can update booking status.' },
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const updated = await updateBookingStatus(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
