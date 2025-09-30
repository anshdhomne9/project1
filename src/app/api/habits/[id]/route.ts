
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Habit from '@/models/Habit';
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

// PUT: Update a habit (e.g., complete it for the day)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const userId = await getUserIdFromToken();

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const habit = await Habit.findOne({ _id: params.id, user: userId });

    if (!habit) {
      return NextResponse.json({ success: false, message: 'Habit not found or unauthorized' }, { status: 404 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastCompleted = habit.lastCompleted ? new Date(habit.lastCompleted) : null;
    if (lastCompleted) {
        lastCompleted.setHours(0, 0, 0, 0);
    }

    // If already completed today, do nothing
    if (lastCompleted && lastCompleted.getTime() === today.getTime()) {
        return NextResponse.json({ success: true, data: habit, message: 'Habit already completed today.' });
    }

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    let newStreak = habit.streak;
    if (lastCompleted && lastCompleted.getTime() === yesterday.getTime()) {
      // It was completed yesterday, so increment streak
      newStreak++;
    } else {
      // It was not completed yesterday, so reset streak to 1
      newStreak = 1;
    }

    habit.streak = newStreak;
    habit.lastCompleted = new Date();

    const updatedHabit = await habit.save();

    return NextResponse.json({ success: true, data: updatedHabit });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

// DELETE: Delete a habit
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const userId = await getUserIdFromToken();

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const deletedHabit = await Habit.findOneAndDelete({ _id: params.id, user: userId });

    if (!deletedHabit) {
      return NextResponse.json({ success: false, message: 'Habit not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
