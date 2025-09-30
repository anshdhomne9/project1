
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import MoodEntry from '@/models/MoodEntry';
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

// GET: Fetch mood history for the logged-in user
export async function GET() {
  await dbConnect();
  const userId = await getUserIdFromToken();

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch moods for the last 30 days, or adjust as needed
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const moods = await MoodEntry.find({
      user: userId,
      date: { $gte: thirtyDaysAgo },
    }).sort({ date: 1 });

    return NextResponse.json({ success: true, data: moods });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

// POST: Create a new mood entry for the logged-in user
export async function POST(request: Request) {
  await dbConnect();
  const userId = await getUserIdFromToken();

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { mood, date } = await request.json();

    // Check if a mood for this user and date already exists
    const existingMood = await MoodEntry.findOne({ user: userId, date: new Date(date).setHours(0,0,0,0) });
    if (existingMood) {
      return NextResponse.json({ message: 'Mood already recorded for this date.' }, { status: 409 });
    }

    const newMoodEntry = await MoodEntry.create({
      mood,
      date: new Date(date).setHours(0,0,0,0), // Store date without time for daily tracking
      user: userId,
    });

    return NextResponse.json({ success: true, data: newMoodEntry }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
