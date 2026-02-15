import { JSX, memo } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

import { ItemType } from '../../model';

export const TodoItem = memo(
  ({ todo, onToggle, onDelete }: ItemType): JSX.Element => (
    <View style={styles.todoItem}>
      <TouchableOpacity
        onPress={() => onToggle(todo.id)}
        style={styles.circle}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: todo.done }}
      >
        {todo.done && <View style={styles.filledCircle} />}
      </TouchableOpacity>

      <Text style={[styles.todoText, todo.done && styles.done]}>
        {todo.text}
      </Text>

      <TouchableOpacity
        onPress={() => onDelete(todo.id)}
        accessibilityLabel="Remove todo"
      >
        <Text style={styles.remove}>REMOVE</Text>
      </TouchableOpacity>
    </View>
  ),
);

const styles = StyleSheet.create({
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#003366',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  filledCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#003366',
  },
  todoText: { flex: 1, fontSize: 16, color: '#000' },
  done: { textDecorationLine: 'line-through', color: '#888' },
  remove: { color: '#003366', fontWeight: 'bold', marginLeft: 12 },
});
