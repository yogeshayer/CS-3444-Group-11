const cors = require('cors');
app.use(cors());
const express = require('express');
const connectToDB = require('./db');

const app = express();

app.get('/', async (req, res) => {
  const db = await connectToDB();                  // connect to DB
  const tasks = await db.collection('tasks').find().toArray();  // read from "tasks" collection
  res.send(tasks);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
