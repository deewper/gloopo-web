import { NextResponse } from 'next/server';

const ATMOS_API_KEY = '76e5abdbd6039c54532b7d8ce0ea4a39aab3b8fd6a7a9bb3cf55d42aab8923e9';
const ATMOS_BASE_URL = 'https://api.atmos.ag/swapRouter';

export async function GET() {
  try {
    const response = await fetch(`${ATMOS_BASE_URL}/tokenlist`, {
      headers: {
        'x-api-key': ATMOS_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Atmos API error: ${response.statusText}`);
    }

    const data = await response.json();
    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
    },
  });
}
