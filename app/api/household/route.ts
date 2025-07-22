import { getUserFromRequest } from "@/lib/auth"
import type { Household, User } from "@/lib/models"
import { getDatabase } from "@/lib/mongodb"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()

    // Get household info - find household by either adminId or user belongs to it
    let household
    if (user.isAdmin) {
      household = await db.collection<Household>("households").findOne({
        adminId: user.userId,
      })
    } else {
      // For regular users, find household through their adminId
      household = await db.collection<Household>("households").findOne({
        adminId: user.adminId,
      })
    }

    if (!household) {
      return NextResponse.json({ error: "Household not found" }, { status: 404 })
    }

    const adminId = user.isAdmin ? user.userId : user.adminId

    // Get all household members (approved users)
    const allMembers = await db
      .collection<User>("users")
      .find({ 
        $or: [
          { id: adminId }, // Admin
          { adminId: adminId, status: "approved" } // Approved roommates
        ]
      })
      .toArray()

    // Get pending requests (only for admin)
    let pendingRequests: User[] = []
    if (user.isAdmin) {
      pendingRequests = await db
        .collection<User>("users")
        .find({ adminId: user.userId, status: "pending" })
        .toArray()
    }

    // Remove passwords from response
    const safeMembers = allMembers.map(({ password, ...user }) => user)
    const safePendingRequests = pendingRequests.map(({ password, ...user }) => user)

    return NextResponse.json({
      household,
      members: safeMembers,
      pendingRequests: safePendingRequests,
      currentUser: {
        id: user.userId,
        isAdmin: user.isAdmin,
      }
    })
  } catch (error) {
    console.error("Get household error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
