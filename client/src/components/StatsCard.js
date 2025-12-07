import React from 'react';
import './StatsCard.css';

const StatsCard = ({ stats }) => {
  if (!stats) return null;

  const statsItems = [
    {
      label: 'Total Tasks',
      value: stats.total,
      color: '#3498db',
      icon: '📋',
    },
    {
      label: 'Pending',
      value: stats.pending,
      color: '#95a5a6',
      icon: '⏳',
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      color: '#3498db',
      icon: '🔄',
    },
    {
      label: 'Completed',
      value: stats.completed,
      color: '#27ae60',
      icon: '✅',
    },
    {
      label: 'High Priority',
      value: stats.highPriority,
      color: '#e74c3c',
      icon: '🔴',
    },
    {
      label: 'Overdue',
      value: stats.overdue,
      color: '#e74c3c',
      icon: '⚠️',
    },
  ];

  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="stats-card">
      <div className="stats-grid">
        {statsItems.map((item, index) => (
          <div key={index} className="stat-item">
            <div className="stat-icon" style={{ color: item.color }}>
              {item.icon}
            </div>
            <div className="stat-content">
              <div className="stat-value">{item.value}</div>
              <div className="stat-label">{item.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="completion-rate">
        <div className="completion-label">Completion Rate</div>
        <div className="completion-bar">
          <div
            className="completion-fill"
            style={{ width: `${completionRate}%` }}
          >
            {completionRate}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;

