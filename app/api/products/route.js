import { NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/db';
import { getCurrentUser, requireSeller } from '@/lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerFilter = searchParams.get('owner');

    let ownerId = undefined;
    if (ownerFilter === 'me') {
      const { user } = await getCurrentUser(request);
      if (!user) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }
      ownerId = user.id;
    } else if (ownerFilter) {
      ownerId = ownerFilter;
    }

    const filters = {
      category: searchParams.get('category') || undefined,
      search: searchParams.get('search') || undefined,
      minPrice: searchParams.get('minPrice') || undefined,
      maxPrice: searchParams.get('maxPrice') || undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      availableOnly: searchParams.get('availableOnly') || undefined,
      ownerId,
    };

    const products = await getProducts(filters);
    return NextResponse.json(products);
  } catch (error) {
    console.error('API /api/products GET error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // 1. Strictly require seller or admin role
    const { errorResponse, user } = await requireSeller(request);
    if (errorResponse) {
      return errorResponse;
    }

    const body = await request.json();
    if (!body.name || !body.category || !body.pricePerDay) {
      return NextResponse.json(
        { error: 'Name, category, and pricePerDay are required' },
        { status: 400 }
      );
    }

    // Owner ID is ALWAYS derived from authenticated user session
    const ownerId = user.id;

    const created = await createProduct(body, ownerId);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('API /api/products POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}
