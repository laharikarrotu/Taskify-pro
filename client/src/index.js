import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import
import './index.css'; // Ensure correct CSS file
import App from './App'; // Correct import
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root')); // Create root for React 18+
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// For performance measurement (optional)
reportWebVitals();
