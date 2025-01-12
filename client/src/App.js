import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [error, setError] = useState("");

  // Fetch tasks from the backend when the app loads
  useEffect(() => {
    fetchTasks();
  }, []);

  // Function to fetch tasks from the server
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Function to handle form submission (add a task)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task) {
      setError("Task cannot be empty.");
      return;
    }
    try {
      await axios.post('http://localhost:5000/tasks', { task });
      fetchTasks(); // Refresh tasks after adding a new one
      setTask("");  // Clear the input field
      setError(""); // Clear error message
    } catch (error) {
      setError("Error adding task. Please try again.");
      console.error('Error creating task:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Taskify - Task Management</h1>
        <form onSubmit={handleSubmit} className="task-form">
          <input 
            type="text" 
            value={task} 
            onChange={(e) => setTask(e.target.value)} 
            placeholder="Add a new task" 
            className="task-input"
          />
          <button type="submit" className="task-btn">Add Task</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </header>

      <div className="tasks-container">
        <h2>Your Tasks</h2>
        {tasks.length === 0 ? (
          <p>No tasks added yet!</p>
        ) : (
          <ul className="task-list">
            {tasks.map((taskItem, index) => (
              <li key={index} className="task-item">
                {taskItem.task}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
