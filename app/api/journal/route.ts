import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    const { pathname, search } = new URL(request.url);
    const path = pathname.replace('/api/journal', '');

    // Forward to backend
    const backendUrl = `${BACKEND_URL}/journal${path}${search}`;
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error('Journal GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { pathname } = new URL(request.url);
    const path = pathname.replace('/api/journal', '');

    let body;
    let headers: Record<string, string> = {
      'Cookie': request.headers.get('cookie') || '',
    };

    // Handle file uploads for upload-image endpoint
    if (path === '/upload-image') {
      const formData = await request.formData();
      body = formData;
      // Don't set Content-Type for FormData, let fetch set it automatically
      delete headers['Content-Type']; // Remove any Content-Type header
    } else {
      body = await request.json();
      headers['Content-Type'] = 'application/json';
    }

    // Forward to backend
    const backendUrl = `${BACKEND_URL}/journal${path}`;
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers,
      body,
    });

    if (path === '/upload-image') {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error('Journal POST API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { pathname } = new URL(request.url);
    const path = pathname.replace('/api/journal', '');

    const body = await request.json();

    // Forward to backend
    const backendUrl = `${BACKEND_URL}/journal${path}`;
    const response = await fetch(backendUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error('Journal PUT API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { pathname } = new URL(request.url);
    const path = pathname.replace('/api/journal', '');

    // Forward to backend
    const backendUrl = `${BACKEND_URL}/journal${path}`;
    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error('Journal DELETE API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}