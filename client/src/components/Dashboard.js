import React, { useState, useEffect, useCallback } from 'react';
import { tasksAPI } from '../utils/api';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import TaskFilters from './TaskFilters';
import StatsCard from './StatsCard';
import TaskTemplates from './TaskTemplates';
import RecurringTaskForm from './RecurringTaskForm';
import './Dashboard.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showRecurringForm, setShowRecurringForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    search: '',
    sortBy: 'createdAt',
    order: 'desc',
  });

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getAll(filters);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await tasksAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  const applyFilters = useCallback(() => {
    if (tasks.length === 0) {
      setFilteredTasks([]);
      return;
    }

    let filtered = [...tasks];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          (task.description && task.description.toLowerCase().includes(searchLower))
      );
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter((task) => task.status === filters.status);
    }

    // Apply priority filter
    if (filters.priority) {
      filtered = filtered.filter((task) => task.priority === filters.priority);
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter((task) => task.category === filters.category);
    }

    // Apply sorting (optimized)
    const sortBy = filters.sortBy;
    const order = filters.order === 'asc' ? 1 : -1;
    
    filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (aValue === bValue) return 0;
      return (aValue > bValue ? 1 : -1) * order;
    });

    setFilteredTasks(filtered);
  }, [tasks, filters]);

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks, fetchStats]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);


  const handleCreateTask = async (taskData) => {
    try {
      await tasksAPI.create(taskData);
      await fetchTasks();
      await fetchStats();
      setShowForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  const handleTemplateSelect = (templateData) => {
    setEditingTask(null);
    setShowForm(true);
    // Pre-fill form with template data
    setTimeout(() => {
      setEditingTask(templateData);
    }, 100);
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      await tasksAPI.update(id, taskData);
      await fetchTasks();
      await fetchStats();
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksAPI.delete(id);
        await fetchTasks();
        await fetchStats();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleToggleStatus = async (task) => {
    const newStatus =
      task.status === 'completed'
        ? 'pending'
        : task.status === 'pending'
        ? 'in-progress'
        : 'completed';

    try {
      await tasksAPI.update(task._id, { status: newStatus });
      await fetchTasks();
      await fetchStats();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleTimeUpdate = useCallback(async (taskId, timeSpent) => {
    try {
      // Update local state immediately for better UX
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId ? { ...task, timeSpent } : task
        )
      );
      // Update backend (debounced calls)
      await tasksAPI.update(taskId, { timeSpent });
    } catch (error) {
      console.error('Error updating task time:', error);
    }
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const categories = [...new Set(tasks.map((task) => task.category))];

  if (loading && tasks.length === 0) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>My Tasks</h1>
        <div className="header-actions">
          <TaskTemplates onSelectTemplate={handleTemplateSelect} />
          <button
            className="btn btn-secondary"
            onClick={() => setShowRecurringForm(true)}
            title="Create Recurring Task"
          >
            🔁 Recurring
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingTask(null);
              setShowForm(true);
            }}
          >
            + New Task
          </button>
        </div>
      </div>

      {stats && <StatsCard stats={stats} />}

      <TaskFilters
        filters={filters}
        categories={categories}
        onFilterChange={handleFilterChange}
      />

      {showForm && (
        <TaskForm
          task={editingTask}
          onSave={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}

      {showRecurringForm && (
        <RecurringTaskForm
          onSave={async (taskData) => {
            try {
              await tasksAPI.create(taskData);
              await fetchTasks();
              await fetchStats();
              setShowRecurringForm(false);
            } catch (error) {
              console.error('Error creating recurring task:', error);
            }
          }}
          onCancel={() => setShowRecurringForm(false)}
        />
      )}

      <div className="tasks-grid">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks found. Create your first task to get started!</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={() => {
                setEditingTask(task);
                setShowForm(true);
              }}
              onDelete={handleDeleteTask}
              onToggleStatus={handleToggleStatus}
              onTimeUpdate={handleTimeUpdate}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;

