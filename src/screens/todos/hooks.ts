import { useState, useEffect, useCallback, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Todo, STORAGE_KEY } from '../../model';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [inputMode, setInputMode] = useState<'add' | 'edit'>('add');
  const [editingId, setEditingId] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const isLoaded = useRef(false);

  // Load todos from storage
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
        isLoaded.current = true;
      }
    };
    loadTodos();
  }, []);

  // Save todos whenever they change
  useEffect(() => {
    const saveTodos = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
      } catch (e) {
        console.warn('Failed to save todos', e);
      }
    };
    if (isLoaded.current) saveTodos();
  }, [todos]);

  const addTodo = useCallback(() => {
    const cleanTodo = newTodo.trim();
    if (!cleanTodo) return;

    if (inputMode === 'edit' && editingId) {
      setTodos(prev =>
        prev.map(t => (t.id === editingId ? { ...t, text: cleanTodo } : t)),
      );
    } else {
      const todo: Todo = {
        id: Date.now().toString(),
        text: cleanTodo,
        done: false,
      };
      setTodos(prev => [todo, ...prev]);
    }

    setNewTodo('');
    setInputMode('add');
    setEditingId(null);
  }, [newTodo, inputMode, editingId]);

  const onToggle = useCallback((id: string) => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  }, []);

  const onDelete = useCallback(
    (id: string) => {
      setTodos(prev => prev.filter(t => t.id !== id));
      // Reset edit mode if deleting the item being edited
      if (id === editingId) {
        setInputMode('add');
        setEditingId(null);
        setNewTodo('');
      }
    },
    [editingId],
  );

  const editTodo = useCallback(
    (id: string) => {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      setInputMode('edit');
      setEditingId(id);
      setNewTodo(todo.text);
    },
    [todos],
  );

  const resetInput = useCallback(() => {
    setInputMode('add');
    setEditingId(null);
    setNewTodo('');
  }, []);

  return {
    insets,
    todos,
    addTodo,
    onDelete,
    onToggle,
    newTodo,
    setNewTodo,
    editTodo,
    inputMode,
    resetInput,
  };
};
