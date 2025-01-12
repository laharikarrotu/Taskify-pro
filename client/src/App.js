import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const fetchTasks = async () => {
    const response = await axios.get(`${API_URL}/tasks`);
    setTasks(response.data);
  };

  const createTask = async () => {
    if (!title.trim()) {
      alert("Task title cannot be empty");
      return;
    }
    try {
      await axios.post(`${API_URL}/tasks`, { title });
      setTitle("");
      fetchTasks();
    } catch (err) {
      console.error("Error in createTask:", err.message);
    }
  };
  

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="App">
      <h1>Taskify Pro</h1>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New Task"
      />
      <button onClick={createTask}>Add Task</button>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
