import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the movie search heading', () => {
  render(<App />);
  const heading = screen.getByText(/Movie Search App With React JS Using OMDB Api/i);
  expect(heading).toBeInTheDocument();
});
