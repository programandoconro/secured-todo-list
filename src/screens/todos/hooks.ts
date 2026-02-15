import { useState, useEffect, useCallback, useRef } from 'react';
import { Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Todo, STORAGE_KEY } from '../../model';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const insets = useSafeAreaInsets();

  // 1. Track if initial load is complete
  const isLoaded = useRef(false);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setTodos(JSON.parse(stored));
        }
      } catch (e) {
        console.warn('Failed to load todos', e);
      } finally {
        // 2. Mark as loaded regardless of success/fail
        isLoaded.current = true;
      }
    };
    loadTodos();
  }, []);

  useEffect(() => {
    const saveTodos = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
      } catch (e) {
        console.warn('Failed to save todos', e);
      }
    };
    saveTodos();
  }, [todos]);

  const addTodo = useCallback(() => {
    const cleanTodo = newTodo.trim();
    if (!cleanTodo) return;

    const todo: Todo = {
      id: Date.now().toString(),
      text: cleanTodo,
      done: false,
    };

    setTodos(prev => [todo, ...prev]);
    setNewTodo('');
    Keyboard.dismiss();
  }, [newTodo]);

  const onToggle = useCallback((id: string) => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  }, []);

  const onDelete = useCallback((id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, []);
  return {
    insets,
    todos,
    addTodo,
    onDelete,
    onToggle,
    newTodo,
    setNewTodo,
  };
};
