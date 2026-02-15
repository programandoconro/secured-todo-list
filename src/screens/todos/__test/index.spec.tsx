import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderHook, act, waitFor } from '@testing-library/react-native';

import { useTodos } from '../hooks';

// 1. Mocking Dependencies
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('react-native-safe-area-context', () => {
  return {
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

describe('useTodos Hook', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
    // Pre-set storage to empty string so JSON.parse doesn't error
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('[]');
    jest.spyOn(Date, 'now').mockReturnValue(12345); // Predictable IDs
  });

  // Helper to ensure hook has finished its initial mounting effects
  const setupHook = async () => {
    const view = renderHook(() => useTodos());
    // Wait for initial loadTodos effect to trigger
    await waitFor(() => expect(AsyncStorage.getItem).toHaveBeenCalled());
    return view;
  };

  it('adds a todo correctly and clears input', async () => {
    const { result } = await setupHook();

    await act(async () => {
      result.current.setNewTodo('Buy Milk');
    });

    await act(async () => {
      result.current.addTodo();
    });

    // waitFor handles the batching update in React 19
    await waitFor(() => {
      expect(result.current.todos).toHaveLength(1);
    });

    expect(result.current.todos[0]).toEqual({
      id: '12345',
      text: 'Buy Milk',
      done: false,
    });
    expect(result.current.newTodo).toBe('');
  });

  it('toggles a todo done status', async () => {
    const { result } = await setupHook();

    await act(async () => {
      result.current.setNewTodo('Task');
    });

    await act(async () => {
      result.current.addTodo();
    });

    await waitFor(() => expect(result.current.todos.length).toBe(1));

    await waitFor(() => {
      expect(result.current.todos[0].done).toBe(false);
    });

    await act(async () => {
      result.current.onToggle('12345');
    });

    await waitFor(() => {
      expect(result.current.todos[0].done).toBe(true);
    });
  });

  it('deletes a todo', async () => {
    const { result } = await setupHook();

    await act(async () => {
      result.current.setNewTodo('Delete Task');
    });

    await act(async () => {
      result.current.addTodo();
    });

    await waitFor(() => expect(result.current.todos.length).toBe(1));

    await act(async () => {
      result.current.onDelete('12345');
    });

    await waitFor(() => {
      expect(result.current.todos).toHaveLength(0);
    });
  });

  it('persists changes to storage', async () => {
    const { result } = await setupHook();

    await act(async () => {
      result.current.setNewTodo('Storage Test');
    });

    await act(async () => {
      result.current.addTodo();
    });

    // Check if setItem was called with our data eventually
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@todos_list',
        expect.stringContaining('Storage Test'),
      );
    });
  });
});
