
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

// GET: Fetch a single calendar event by ID for the logged-in user
export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const userId = await getUserIdFromToken();

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const event = await CalendarEvent.findOne({ _id: params.id, user: userId });

    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

// PUT: Update a calendar event by ID for the logged-in user
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const userId = await getUserIdFromToken();

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const event = await CalendarEvent.findOneAndUpdate(
      { _id: params.id, user: userId },
      body,
      { new: true, runValidators: true }
    );

    if (!event) {
      return NextResponse.json({ message: 'Event not found or not authorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

// DELETE: Delete a calendar event by ID for the logged-in user
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const userId = await getUserIdFromToken();

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const deletedEvent = await CalendarEvent.findOneAndDelete({ _id: params.id, user: userId });

    if (!deletedEvent) {
      return NextResponse.json({ message: 'Event not found or not authorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
