import React, { useState } from 'react';
import TimeTracker from './TimeTracker';
import './TaskCard.css';

const TaskCard = ({ task, onEdit, onDelete, onToggleStatus, onTimeUpdate }) => {
  const [showTimeTracker, setShowTimeTracker] = useState(false);
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#e74c3c';
      case 'medium':
        return '#f39c12';
      case 'low':
        return '#3498db';
      default:
        return '#95a5a6';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#27ae60';
      case 'in-progress':
        return '#3498db';
      case 'pending':
        return '#95a5a6';
      default:
        return '#95a5a6';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = () => {
    if (!task.dueDate || task.status === 'completed') return false;
    return new Date(task.dueDate) < new Date();
  };

  return (
    <div className={`task-card ${task.status === 'completed' ? 'completed' : ''}`}>
      <div className="task-card-header">
        <div className="task-card-title-section">
          <h3 className="task-title">{task.title}</h3>
          <div className="task-badges">
            <span
              className="badge priority-badge"
              style={{ backgroundColor: getPriorityColor(task.priority) }}
            >
              {task.priority}
            </span>
            <span
              className="badge status-badge"
              style={{ backgroundColor: getStatusColor(task.status) }}
            >
              {task.status.replace('-', ' ')}
            </span>
            {task.category && task.category !== 'general' && (
              <span className="badge category-badge">{task.category}</span>
            )}
          </div>
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      {task.dueDate && (
        <div className={`task-due-date ${isOverdue() ? 'overdue' : ''}`}>
          <span className="due-date-icon">📅</span>
          <span>{formatDate(task.dueDate)}</span>
          {isOverdue() && <span className="overdue-label">Overdue</span>}
        </div>
      )}

      {task.timeSpent > 0 && (
        <div className="task-time-spent">
          <span className="time-icon">⏱️</span>
          <span>{formatTime(task.timeSpent)}</span>
        </div>
      )}

      <div className="task-card-actions">
        <button
          className="btn btn-sm btn-secondary"
          onClick={() => setShowTimeTracker(!showTimeTracker)}
          title="Time Tracker"
        >
          ⏱️ Timer
        </button>
        <button
          className="btn btn-sm btn-secondary"
          onClick={() => onToggleStatus(task)}
        >
          {task.status === 'completed' ? 'Mark Incomplete' : 'Mark Complete'}
        </button>
        <button className="btn btn-sm btn-edit" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => onDelete(task._id)}
        >
          Delete
        </button>
      </div>

      {showTimeTracker && (
        <TimeTracker 
          task={task} 
          onTimeUpdate={onTimeUpdate}
        />
      )}
    </div>
  );
};

const formatTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }
  return `${mins}m ${secs}s`;
};

export default TaskCard;

