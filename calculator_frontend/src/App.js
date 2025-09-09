import React from 'react';
import './App.css';
import Calculator from './components/Calculator';

/**
 * App is the root component for the calculator frontend.
 * It renders a centered calculator panel with a display and keypad.
 */
 // PUBLIC_INTERFACE
export default function App() {
  return (
    <div className="App app-shell">
      <main className="app-main">
        <Calculator />
      </main>
      <footer className="app-footer" aria-label="footer">
        <span>Modern Minimal Calculator</span>
      </footer>
    </div>
  );
}
