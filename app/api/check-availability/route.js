import { NextResponse } from 'next/server';
import { checkAvailability } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { productId, startDate, endDate } = body;

    if (!productId || !startDate || !endDate) {
      return NextResponse.json({ error: 'productId, startDate, and endDate are required' }, { status: 400 });
    }

    const result = await checkAvailability(productId, startDate, endDate);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
