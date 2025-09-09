import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

/**
 * PUBLIC_INTERFACE
 * ThemeToggle renders a button to switch between light and dark themes.
 * Uses moon/sun icons to indicate current and target theme states.
 */
export default function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span className="theme-toggle-icon">
        {isDark ? '☀️' : '🌙'}
      </span>
    </button>
  );
}
