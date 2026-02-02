import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://tamtechaifinance-backend-production.up.railway.app';

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const adminKey = url.searchParams.get('admin_key');
    
    const response = await fetch(`${BACKEND_URL}/admin/refresh-all-tickers?admin_key=${adminKey}`, {
      method: 'POST',
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, detail: error.message },
      { status: 500 }
    );
  }
}
