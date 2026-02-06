import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET() {
  const endpoints = store.getAllEndpoints();
  return NextResponse.json(endpoints);
}

export async function POST(request: Request) {
  try {
    const { name, url, expectedStatus } = await request.json();
    
    if (!name || !url) {
      return NextResponse.json(
        { error: 'Name and URL are required' },
        { status: 400 }
      );
    }

    const endpoint = store.addEndpoint(name, url, expectedStatus || 200);
    return NextResponse.json(endpoint, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const deleted = store.deleteEndpoint(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Endpoint not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
