const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authenticate = require('../middleware/auth');

// Get all tasks for authenticated user with filtering and sorting
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, priority, category, search, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    // Build query
    const query = { userId: req.user._id };
    
    if (status) {
      query.status = status;
    }
    
    if (priority) {
      query.priority = priority;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = order === 'asc' ? 1 : -1;

    const tasks = await Task.find(query).sort(sort);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
});

// Get task statistics
router.get('/stats', authenticate, async (req, res) => {
  try {
    const total = await Task.countDocuments({ userId: req.user._id });
    const pending = await Task.countDocuments({ userId: req.user._id, status: 'pending' });
    const inProgress = await Task.countDocuments({ userId: req.user._id, status: 'in-progress' });
    const completed = await Task.countDocuments({ userId: req.user._id, status: 'completed' });
    const highPriority = await Task.countDocuments({ userId: req.user._id, priority: 'high', status: { $ne: 'completed' } });
    
    // Get overdue tasks
    const overdue = await Task.countDocuments({
      userId: req.user._id,
      dueDate: { $lt: new Date() },
      status: { $ne: 'completed' }
    });

    res.json({
      total,
      pending,
      inProgress,
      completed,
      highPriority,
      overdue
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
});

// Get single task by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid task ID' });
    }
    res.status(500).json({ message: 'Error fetching task', error: error.message });
  }
});

// Create a new task
router.post('/', authenticate, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      status, 
      priority, 
      category, 
      dueDate,
      isRecurring,
      recurrencePattern,
      timeSpent
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const taskData = {
      title,
      description: description || '',
      status: status || 'pending',
      priority: priority || 'medium',
      category: category || 'general',
      dueDate: dueDate || null,
      userId: req.user._id,
      timeSpent: timeSpent || 0
    };

    // Handle recurring tasks
    if (isRecurring && recurrencePattern) {
      taskData.isRecurring = true;
      taskData.recurrencePattern = {
        frequency: recurrencePattern.frequency,
        interval: recurrencePattern.interval || 1,
        endDate: recurrencePattern.endDate || null,
        lastGenerated: null
      };
    }

    const task = new Task(taskData);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
});

// Update a task
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { title, description, status, priority, category, dueDate, timeSpent } = req.body;

    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (category !== undefined) task.category = category;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (timeSpent !== undefined) task.timeSpent = timeSpent;

    // Set completedAt when status changes to completed
    if (status === 'completed' && task.status !== 'completed') {
      task.completedAt = new Date();
    } else if (status !== 'completed' && task.status === 'completed') {
      task.completedAt = null;
    }

    await task.save();
    res.json(task);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid task ID' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
});

// Delete a task
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted successfully', task });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid task ID' });
    }
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
});

// Bulk delete tasks
router.delete('/', authenticate, async (req, res) => {
  try {
    const { taskIds } = req.body;
    
    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of task IDs' });
    }

    const result = await Task.deleteMany({
      _id: { $in: taskIds },
      userId: req.user._id
    });

    res.json({ 
      message: `${result.deletedCount} task(s) deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting tasks', error: error.message });
  }
});

module.exports = router;

