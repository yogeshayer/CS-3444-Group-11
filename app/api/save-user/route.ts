
import { connectToDatabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { db } = await connectToDatabase();
    const result = await db.collection('users').insertOne(body);

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Error saving user:', error);
    return NextResponse.json({ success: false, error: 'Failed to save user' }, { status: 500 });
  }
}
