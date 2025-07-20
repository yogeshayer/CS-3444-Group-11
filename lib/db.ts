import { Db, MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || "mongodb+srv://ayersunil018:W4adLEnO6fcjCXSt@cluster0.ahcmhct.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

let client: MongoClient
let db: Db

export async function connectToDatabase() {
  if (db) {
    return { client, db }
  }

  try {
    client = new MongoClient(uri)
    await client.connect()
    db = client.db('ChoreBoard')
    console.log('✅ Connected to MongoDB!')
    return { client, db }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    throw error
  }
}

export { db }
