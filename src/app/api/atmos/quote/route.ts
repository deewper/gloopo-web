import { NextResponse } from 'next/server';

const ATMOS_API_KEY = '76e5abdbd6039c54532b7d8ce0ea4a39aab3b8fd6a7a9bb3cf55d42aab8923e9';
const ATMOS_BASE_URL = 'https://api.atmos.ag/swapRouter';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { srcCoin, dstCoin, srcAmount, dstAddress, slippage } = body;

    const response = await fetch(`${ATMOS_BASE_URL}/swap/quote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ATMOS_API_KEY
      },
      body: JSON.stringify({
        srcCoin,
        dstCoin,
        srcAmount,
        dstAddress: dstAddress || '0x0', // Mock address if not provided
        slippage: slippage || 0.5
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Atmos API Error:', errorText);
      throw new Error(`Atmos API error: ${response.statusText}`);
    }

    const data = await response.json();
    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
      },
    });
  } catch (error: any) {
    console.error('Proxy Error:', error);
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
    },
  });
}
