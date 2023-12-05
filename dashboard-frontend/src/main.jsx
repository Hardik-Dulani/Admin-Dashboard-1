// index.js or index.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import './App.css'; // Import the styles
import App from './App'; // Your main React component

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
