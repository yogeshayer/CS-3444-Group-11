import { connectToDatabase } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()

    const body = await request.json()

    // ✅ Debug logs – add these two lines below
    console.log("🔥 API HIT: /api/add Task")
    console.log("📦 Request Body:", body)

    const newTask = {
      title: body.title,
      completed: body.completed || false,
      createdAt: new Date(),
    }

    const result = await db.collection('tasks').insertOne(newTask)

    return NextResponse.json({ 
      success: true, 
      id: result.insertedId,
      task: newTask 
    })

  } catch (error) {
    console.error('❌ Error adding task:', error)
    return NextResponse.json({ error: 'Failed to add task' }, { status: 500 })
  }
}
