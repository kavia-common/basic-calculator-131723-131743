import React from 'react';
import './App.css';
import Calculator from './components/Calculator';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './context/ThemeContext';

/**
 * App is the root component for the calculator frontend.
 * It renders a centered calculator panel with a display and keypad,
 * wrapped in a ThemeProvider for dark/light mode support.
 */
 // PUBLIC_INTERFACE
export default function App() {
  return (
    <ThemeProvider>
      <div className="App app-shell">
        <ThemeToggle />
        <main className="app-main">
          <Calculator />
        </main>
        <footer className="app-footer" aria-label="footer">
          <span>Modern Minimal Calculator</span>
        </footer>
      </div>
    </ThemeProvider>
  );
}
