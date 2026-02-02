import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://tamtechaifinance-backend-production.up.railway.app';

export async function GET(request: NextRequest) {
  try {
    // Forward request to backend with cookies
    const response = await fetch(`${BACKEND_URL}/admin/articles-list`, {
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
