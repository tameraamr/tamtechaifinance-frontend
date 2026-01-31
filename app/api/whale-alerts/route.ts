import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '50';

    // Forward to backend
    const backendUrl = 'https://tamtechaifinance-backend-production.up.railway.app';
    const response = await fetch(`${backendUrl}/whale-alerts?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Whale alerts API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch whale alerts' },
      { status: 500 }
    );
  }
}