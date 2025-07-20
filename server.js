const express = require('express');
const cors = require('cors');
const connectToDB = require('./db');

const app = express(); // ✅ Define app BEFORE using it

app.use(cors()); // ✅ Now this works fine
app.use(express.json()); // parse JSON body

app.get('/', (req, res) => {
  res.send('Welcome to ChoreBoard API!');
});

app.get('/tasks', async (req, res) => {
  const db = await connectToDB();
  const tasks = await db.collection('tasks').find().toArray();
  res.json(tasks);
});

app.post('/add-task', async (req, res) => {
  const db = await connectToDB();
  const { title, completed } = req.body;
  const result = await db.collection('tasks').insertOne({ title, completed });
  res.json({ message: '✅ Task added!', taskId: result.insertedId });
});

app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));
