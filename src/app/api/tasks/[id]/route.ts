
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

// GET: Fetch a single task
export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const userId = await getUserIdFromToken();

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const task = await Task.findOne({ _id: params.id, user: userId });
    if (!task) {
      return NextResponse.json({ success: false, message: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: task });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

// PUT: Update a task
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const userId = await getUserIdFromToken();

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    let task = await Task.findOne({ _id: params.id, user: userId });

    if (!task) {
      return NextResponse.json({ success: false, message: 'Task not found or unauthorized' }, { status: 404 });
    }

    const body = await request.json();
    task = await Task.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({ success: true, data: task });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

// DELETE: Delete a task
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const userId = await getUserIdFromToken();

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const deletedTask = await Task.findOneAndDelete({ _id: params.id, user: userId });

    if (!deletedTask) {
      return NextResponse.json({ success: false, message: 'Task not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
