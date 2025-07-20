import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const users = await db.collection("users");

  const existing = await users.findOne({ email: body.email });
  if (existing) {
    return NextResponse.json({ message: "User already exists" }, { status: 400 });
  }

  await users.insertOne(body);

  return NextResponse.json({ message: "User registered successfully" }, { status: 200 });
}
