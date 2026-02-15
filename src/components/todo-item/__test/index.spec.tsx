import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TodoItem } from '..';

describe('Item Component', () => {
  const mockTodo = {
    id: '1',
    text: 'Test Todo',
    done: false,
  };

  const mockOnToggle = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly in default state (not done)', () => {
    const { toJSON, getByText } = render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />,
    );

    expect(getByText('Test Todo')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders correctly in completed state (done)', () => {
    const doneTodo = { ...mockTodo, done: true };
    const { toJSON } = render(
      <TodoItem
        todo={doneTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('calls onToggle with correct id when circle is pressed', () => {
    const { getByRole } = render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />,
    );

    const checkbox = getByRole('checkbox');
    fireEvent.press(checkbox);

    expect(mockOnToggle).toHaveBeenCalledWith('1');
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete with correct id when REMOVE is pressed', () => {
    const { getByText } = render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />,
    );

    const removeButton = getByText('REMOVE');
    fireEvent.press(removeButton);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });
});
