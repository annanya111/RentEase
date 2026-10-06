import { NextResponse } from 'next/server';
import { getStats } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(request) {
  try {
    // Strictly require admin role
    const { errorResponse } = await requireAdmin(request);
    if (errorResponse) {
      return errorResponse;
    }

    const stats = await getStats();
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
