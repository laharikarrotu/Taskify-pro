import React, { useState } from 'react';
import './TaskTemplates.css';

const TaskTemplates = ({ onSelectTemplate }) => {
  const [showTemplates, setShowTemplates] = useState(false);

  const templates = [
    {
      id: 'meeting',
      name: 'Meeting',
      icon: '📅',
      task: {
        title: 'Team Meeting',
        description: 'Weekly team sync meeting',
        priority: 'medium',
        category: 'work',
        dueDate: null
      }
    },
    {
      id: 'code-review',
      name: 'Code Review',
      icon: '👨‍💻',
      task: {
        title: 'Code Review',
        description: 'Review pull request and provide feedback',
        priority: 'high',
        category: 'development',
        dueDate: null
      }
    },
    {
      id: 'bug-fix',
      name: 'Bug Fix',
      icon: '🐛',
      task: {
        title: 'Fix Bug',
        description: 'Investigate and fix reported bug',
        priority: 'high',
        category: 'development',
        dueDate: null
      }
    },
    {
      id: 'documentation',
      name: 'Documentation',
      icon: '📝',
      task: {
        title: 'Update Documentation',
        description: 'Update project documentation',
        priority: 'medium',
        category: 'work',
        dueDate: null
      }
    },
    {
      id: 'exercise',
      name: 'Exercise',
      icon: '💪',
      task: {
        title: 'Exercise',
        description: 'Daily workout routine',
        priority: 'medium',
        category: 'health',
        dueDate: null
      }
    },
    {
      id: 'shopping',
      name: 'Shopping',
      icon: '🛒',
      task: {
        title: 'Grocery Shopping',
        description: 'Buy groceries for the week',
        priority: 'low',
        category: 'personal',
        dueDate: null
      }
    },
    {
      id: 'learning',
      name: 'Learning',
      icon: '📚',
      task: {
        title: 'Learn New Skill',
        description: 'Study and practice new technology',
        priority: 'medium',
        category: 'learning',
        dueDate: null
      }
    },
    {
      id: 'email',
      name: 'Email Follow-up',
      icon: '📧',
      task: {
        title: 'Follow up on Email',
        description: 'Respond to important emails',
        priority: 'medium',
        category: 'work',
        dueDate: null
      }
    }
  ];

  const handleTemplateSelect = (template) => {
    // Set due date to today if not specified
    const taskData = {
      ...template.task,
      dueDate: template.task.dueDate || new Date().toISOString().split('T')[0]
    };
    onSelectTemplate(taskData);
    setShowTemplates(false);
  };

  if (!showTemplates) {
    return (
      <button
        className="btn btn-secondary template-toggle"
        onClick={() => setShowTemplates(true)}
      >
        📋 Templates
      </button>
    );
  }

  return (
    <div className="templates-overlay">
      <div className="templates-modal">
        <div className="templates-header">
          <h3>Task Templates</h3>
          <button
            className="close-btn"
            onClick={() => setShowTemplates(false)}
          >
            ×
          </button>
        </div>
        <div className="templates-grid">
          {templates.map((template) => (
            <div
              key={template.id}
              className="template-card"
              onClick={() => handleTemplateSelect(template)}
            >
              <div className="template-icon">{template.icon}</div>
              <div className="template-name">{template.name}</div>
              <div className="template-preview">
                <div className="preview-title">{template.task.title}</div>
                <div className="preview-category">{template.task.category}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskTemplates;

