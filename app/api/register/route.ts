import { users } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  const existingUser = await users.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ message: "User already exists" }, { status: 400 });
  }

  const result = await users.insertOne({ name, email, password });
  return NextResponse.json({ message: "Registered successfully", user: result });
}
