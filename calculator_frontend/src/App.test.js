import { render, screen } from '@testing-library/react';
import App from './App';

test('renders calculator display and keypad', () => {
  render(<App />);
  expect(screen.getByRole('application', { name: /calculator/i })).toBeInTheDocument();
  expect(screen.getByText(/Modern Minimal Calculator/i)).toBeInTheDocument();
});
