import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with that email or username already exists.' },
        { status: 409 }
      );
    }

    // Create new user (password will be hashed by the pre-save middleware)
    const user = await User.create({
      username,
      email,
      password,
    });

    // Don't send the password back, even hashed
    (user as any).password = undefined;

    return NextResponse.json(
      { 
        success: true, 
        message: 'User created successfully', 
        data: user 
      },
      { status: 201 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { 
        message: 'An error occurred during registration.', 
        error: error.message 
      },
      { status: 500 }
    );
  }
}