
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // We are acting as a proxy. The browser will call our API (/api/quote),
    // and our server will call the ZenQuotes API.
    // This avoids CORS issues because this is a server-to-server request.
    const response = await fetch('https://zenquotes.io/api/random', {
      // It's good practice to set a timeout for external API calls.
      // This can be done using an AbortController.
      signal: AbortSignal.timeout(5000), // 5-second timeout
    });

    if (!response.ok) {
      // If the external API call fails, we forward the error.
      return NextResponse.json(
        { message: 'Failed to fetch quote from external API.' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Forward the successful response to the client.
    return NextResponse.json(data, { status: 200 });

  } catch (error: any) {
    // Handle network errors or timeouts
    return NextResponse.json(
      { message: 'An error occurred while fetching the quote.', error: error.message },
      { status: 500 }
    );
  }
}
