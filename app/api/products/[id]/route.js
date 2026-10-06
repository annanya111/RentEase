import { NextResponse } from 'next/server';
import { getProductById, updateProduct, deleteProduct } from '@/lib/db';
import { requireSeller } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const product = await getProductById(params.id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { errorResponse, user, profile, role } = await requireSeller(request);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const updated = await updateProduct(params.id, body, { user, profile, role });
    if (!updated) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function PATCH(request, { params }) {
  return PUT(request, { params });
}

export async function DELETE(request, { params }) {
  try {
    const { errorResponse, user, profile, role } = await requireSeller(request);
    if (errorResponse) return errorResponse;

    const success = await deleteProduct(params.id, { user, profile, role });
    if (!success) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
