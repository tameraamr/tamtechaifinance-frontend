import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ ticker: string }> }) {
  try {
    const { ticker } = await params;
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '1d';
    const interval = searchParams.get('interval') || '1d';

    // Forward to backend
    const backendUrl = 'http://127.0.0.1:8000';
    const response = await fetch(`${backendUrl}/api/stock-chart/${ticker}?range=${range}&interval=${interval}`, {
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
    console.error('Stock chart API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock chart' },
      { status: 500 }
    );
  }
}