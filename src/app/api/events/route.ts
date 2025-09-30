
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import CalendarEvent from '@/models/CalendarEvent';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;

async function getUserIdFromToken() {
  const token = cookies().get('token')?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload.id as string;
  } catch (e) {
    return null;
  }
}

// GET: Fetch all calendar events for the logged-in user
export async function GET() {
  await dbConnect();
  const userId = await getUserIdFromToken();

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const events = await CalendarEvent.find({ user: userId }).sort({ startTime: 1 });
    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

// POST: Create a new calendar event for the logged-in user
export async function POST(request: Request) {
  await dbConnect();
  const userId = await getUserIdFromToken();

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const event = await CalendarEvent.create({ ...body, user: userId });
    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
