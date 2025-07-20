// models/user.ts
import { db } from "@/lib/firebase";

export const users = db.collection("users");
