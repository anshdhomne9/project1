
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Clear the authentication cookie
    cookies().set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      expires: new Date(0),
      path: '/',
    });

    return NextResponse.json({ message: 'Logout successful' }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'An error occurred during logout.' }, { status: 500 });
  }
}
