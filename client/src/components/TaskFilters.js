import React from 'react';
import './TaskFilters.css';

const TaskFilters = ({ filters, categories, onFilterChange }) => {
  const handleChange = (name, value) => {
    onFilterChange({ [name]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      status: '',
      priority: '',
      category: '',
      search: '',
      sortBy: 'createdAt',
      order: 'desc',
    });
  };

  const hasActiveFilters =
    filters.status || filters.priority || filters.category || filters.search;

  return (
    <div className="task-filters">
      <div className="filters-row">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="filter-group">
          <select
            value={filters.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="filter-group">
          <select
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <select
            value={`${filters.sortBy}-${filters.order}`}
            onChange={(e) => {
              const [sortBy, order] = e.target.value.split('-');
              handleChange('sortBy', sortBy);
              handleChange('order', order);
            }}
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="dueDate-asc">Due Date (Earliest)</option>
            <option value="dueDate-desc">Due Date (Latest)</option>
            <option value="priority-desc">Priority (High to Low)</option>
            <option value="title-asc">Title (A-Z)</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button className="btn btn-sm btn-secondary" onClick={clearFilters}>
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskFilters;

