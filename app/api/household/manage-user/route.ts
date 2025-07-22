import { getUserFromRequest } from "@/lib/auth"
import type { User } from "@/lib/models"
import { getDatabase } from "@/lib/mongodb"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!user.isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { action, userId } = await request.json()

    if (!action || !userId) {
      return NextResponse.json({ error: "Action and userId are required" }, { status: 400 })
    }

    const db = await getDatabase()

    if (action === "approve") {
      // Approve pending user
      const result = await db.collection<User>("users").updateOne(
        { id: userId, adminId: user.userId, status: "pending" },
        { 
          $set: { 
            status: "approved",
            joinedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          } 
        }
      )

      if (result.matchedCount === 0) {
        return NextResponse.json({ error: "User not found or already approved" }, { status: 404 })
      }

      return NextResponse.json({ message: "User approved successfully" })

    } else if (action === "remove") {
      // Remove user from household
      const result = await db.collection<User>("users").deleteOne(
        { id: userId, adminId: user.userId }
      )

      if (result.deletedCount === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      return NextResponse.json({ message: "User removed successfully" })

    } else {
      return NextResponse.json({ error: "Invalid action. Use 'approve' or 'remove'" }, { status: 400 })
    }

  } catch (error) {
    console.error("Manage user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 