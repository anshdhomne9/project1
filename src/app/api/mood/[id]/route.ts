
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

// DELETE: Delete a mood entry by ID for the logged-in user
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const userId = await getUserIdFromToken();

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const deletedMood = await MoodEntry.findOneAndDelete({ _id: params.id, user: userId });

    if (!deletedMood) {
      return NextResponse.json({ message: 'Mood entry not found or not authorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
