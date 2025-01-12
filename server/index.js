const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => res.send("API is running!"));

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

const Task = require("./models/Task");

app.post("/tasks", async (req, res) => {
  try {
    if (!req.body.title) {
      throw new Error("Task title is required");
    }
    const task = new Task(req.body);
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    console.error("Error in POST /tasks:", err.message);
    res.status(400).send({ error: err.message });
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).send(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err.message);
    res.status(500).send({ error: err.message });
  }
});


