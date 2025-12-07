import React, { useState } from 'react';
import './RecurringTaskForm.css';

const RecurringTaskForm = ({ onSave, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'medium',
    category: initialData?.category || 'general',
    frequency: initialData?.recurrencePattern?.frequency || 'daily',
    interval: initialData?.recurrencePattern?.interval || 1,
    endDate: initialData?.recurrencePattern?.endDate 
      ? new Date(initialData.recurrencePattern.endDate).toISOString().split('T')[0]
      : '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'interval' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const taskData = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      category: formData.category,
      isRecurring: true,
      recurrencePattern: {
        frequency: formData.frequency,
        interval: formData.interval,
        endDate: formData.endDate || null
      }
    };

    onSave(taskData);
  };

  return (
    <div className="recurring-form-overlay">
      <div className="recurring-form-modal">
        <div className="recurring-form-header">
          <h3>Create Recurring Task</h3>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="recurring-form">
          <div className="form-group">
            <label>Task Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Daily Standup"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Task description"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., work"
              />
            </div>
          </div>

          <div className="recurrence-section">
            <h4>Recurrence Settings</h4>
            
            <div className="form-row">
              <div className="form-group">
                <label>Frequency *</label>
                <select name="frequency" value={formData.frequency} onChange={handleChange} required>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="form-group">
                <label>Repeat Every</label>
                <input
                  type="number"
                  name="interval"
                  value={formData.interval}
                  onChange={handleChange}
                  min="1"
                  placeholder="1"
                />
                <span className="interval-label">
                  {formData.frequency === 'daily' ? 'day(s)' : 
                   formData.frequency === 'weekly' ? 'week(s)' : 'month(s)'}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label>End Date (Optional)</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
              <small>Leave empty for no end date</small>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Recurring Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecurringTaskForm;

