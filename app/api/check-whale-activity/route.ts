import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Forward to backend
    const backendUrl = 'http://127.0.0.1:8000';
    const response = await fetch(`${backendUrl}/check-whale-activity`, {
      method: 'POST',
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
    console.error('Check whale activity API error:', error);
    return NextResponse.json(
      { error: 'Failed to check whale activity' },
      { status: 500 }
    );
  }
}