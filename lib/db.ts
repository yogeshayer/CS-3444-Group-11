import { Db, MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
let client: MongoClient;
let db: Db;

export async function connectToDatabase() {
  if (db) return { db };
  client = new MongoClient(uri);
  await client.connect();
  db = client.db('ChoreBoard');
  return { db };
}
