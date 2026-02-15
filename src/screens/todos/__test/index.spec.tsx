import React from 'react';
import renderer from 'react-test-renderer';
import { act } from 'react-test-renderer'; // same import
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTodos } from '../hooks';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

// Mock useSafeAreaInsets
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }: any) => children,
}));

describe('useTodos hook', () => {
  beforeEach(() => {
    (AsyncStorage.getItem as jest.Mock).mockReset();
    (AsyncStorage.setItem as jest.Mock).mockReset();
  });

  const renderHookInComponent = async () => {
    const hookRef: { current?: ReturnType<typeof useTodos> } = {};

    const TestComponent = ({ hookRef }: { hookRef: any }) => {
      hookRef.current = useTodos();
      return null;
    };

    await act(async () => {
      renderer.create(<TestComponent hookRef={hookRef} />);
      // wait for async useEffect in hook
      await Promise.resolve();
    });

    return hookRef;
  };

  it('adds a new todo and clears input', async () => {
    const hookRef = await renderHookInComponent();
    const hook = hookRef.current!;

    act(() => {
      hook.setNewTodo('New Task');
      hook.addTodo();
    });

    expect(hook.todos[0].text).toBe('New Task');
    expect(hook.newTodo).toBe('');
  });

  it('toggles a todo', async () => {
    const hookRef = await renderHookInComponent();
    const hook = hookRef.current!;

    act(() => {
      hook.setNewTodo('Toggle Task');
      hook.addTodo();
    });

    const id = hook.todos[0].id;

    act(() => {
      hook.toggleTodo(id);
    });
    expect(hook.todos[0].done).toBe(true);

    act(() => {
      hook.toggleTodo(id);
    });
    expect(hook.todos[0].done).toBe(false);
  });

  it('deletes a todo', async () => {
    const hookRef = await renderHookInComponent();
    const hook = hookRef.current!;

    act(() => {
      hook.setNewTodo('Delete Task');
      hook.addTodo();
    });

    const id = hook.todos[0].id;

    act(() => {
      hook.deleteTodo(id);
    });
    expect(hook.todos.length).toBe(0);
  });
});
