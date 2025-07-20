import { db } from "@/lib/firebase"
import { addDoc, collection } from "firebase/firestore"

export async function POST(req: Request) {
  const body = await req.json()

  try {
    const docRef = await addDoc(collection(db, "users"), {
      name: body.name,
      email: body.email,
      password: body.password
    })

    return new Response(JSON.stringify({ message: "User added", id: docRef.id }), { status: 200 })
  } catch (error) {
    console.error("❌ Firebase Error:", error)
    return new Response(JSON.stringify({ error: "Failed to add user" }), { status: 500 })
  }
}
