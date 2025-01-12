const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Task = require('./models/Task');
const port = 5000;


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());



// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));
  
let tasks = [
  { id: 1, title: 'Task 1', description: 'Description of Task 1' },
  { id: 2, title: 'Task 2', description: 'Description of Task 2' },
];

// Get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new task
app.post('/tasks', async (req, res) => {
  const { task } = req.body;

  const newTask = new Task({ task });

  try {
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
