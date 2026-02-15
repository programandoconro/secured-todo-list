import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) setTodos(JSON.parse(stored));
      } catch (e) {
        console.warn('Failed to load todos', e);
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

  const addTodo = () => {
    if (!newTodo.trim()) return;
    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo,
      done: false,
    };
    setTodos([todo, ...todos]);
    setNewTodo('');
    Keyboard.dismiss();
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };
  return {
    insets,
    todos,
    addTodo,
    deleteTodo,
    toggleTodo,
    newTodo,
    setNewTodo,
  };
};
type Todo = {
  id: string;
  text: string;
  done: boolean;
};
const STORAGE_KEY = '@todos_list';
