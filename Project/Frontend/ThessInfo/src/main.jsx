// 1) Πρώτα κάνεις το override του console.error
const origConsoleError = console.error;
console.error = (...args) => {
  if (
    args[0] &&
    typeof args[0] === 'string' &&
    args[0].includes('injectScriptAdjust.js')
  ) {
    return; // Αγνόησε αυτά τα σφάλματα
  }
  origConsoleError(...args);
};

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from "react-router-dom"
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
