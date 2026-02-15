import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Login } from '..'; // Adjust path as needed

describe('Login Component', () => {
  it('renders the retry button correctly', () => {
    const mockOnRetry = jest.fn();
    const { getByText } = render(<Login onRetry={mockOnRetry} />);

    // Check if the button exists by its title
    const button = getByText('Retry Login');
    expect(button).toBeTruthy();
  });

  it('calls onRetry when the button is pressed', () => {
    const mockOnRetry = jest.fn();
    const { getByText } = render(<Login onRetry={mockOnRetry} />);

    // Find the button and simulate a press
    const button = getByText('Retry Login');
    fireEvent.press(button);

    // Verify the function passed as a prop was actually called
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('matches snapshot', () => {
    const mockOnRetry = jest.fn();
    const tree = render(<Login onRetry={mockOnRetry} />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
