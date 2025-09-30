
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';
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

// GET: Fetch all tasks for the logged-in user
export async function GET() {
  await dbConnect();
  const userId = await getUserIdFromToken();

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: tasks });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

// POST: Create a new task for the logged-in user
export async function POST(request: Request) {
  await dbConnect();
  const userId = await getUserIdFromToken();

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, description, dueDate, status } = await request.json();
    const task = await Task.create({ 
      title, 
      description, 
      dueDate, 
      status, 
      user: userId 
    });
    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
