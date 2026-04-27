import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// Global CSS — includes Tailwind base styles and custom CSS variables
import './index.css'

// Mount the React app into the #root div defined in index.html
// createRoot is the React 18 API that enables concurrent rendering features
ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode — enables extra development warnings and double-invokes lifecycle methods
  // to help detect side effects. Has no effect in production builds.
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
