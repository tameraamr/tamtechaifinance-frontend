import { NextResponse } from 'next/server';

const BACKEND_URL = 'https://tamtechaifinance-backend-production.up.railway.app';

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/featured-article`, {
      cache: 'no-store'
    });
    
    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Error fetching featured article:', error);
    return NextResponse.json(
      { success: false, detail: error.message },
      { status: 500 }
    );
  }
}
