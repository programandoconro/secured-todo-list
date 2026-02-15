import { JSX } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { TodoItem } from '../../components/todo-item';
import { useTodos } from './hooks';

export const Todos = (): JSX.Element => {
  const {
    insets,
    todos,
    onDelete,
    onToggle,
    addTodo,
    newTodo,
    setNewTodo,
    editTodo,
    inputMode,
  } = useTodos();

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <Text style={styles.header}>TODO:</Text>

        <FlatList
          data={todos}
          keyExtractor={item => item.id}
          style={styles.list}
          renderItem={({ item }) => (
            <TodoItem
              todo={item}
              onDelete={onDelete}
              onToggle={onToggle}
              onEdit={editTodo}
            />
          )}
          ListEmptyComponent={<Text style={styles.empty}>No todos yet</Text>}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add a todo..."
            value={newTodo}
            onChangeText={setNewTodo}
          />
          <TouchableOpacity style={styles.addButton} onPress={addTodo}>
            <Text style={styles.addButtonText}>
              {inputMode === 'add' ? 'ADD' : 'EDIT'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f0f0f0' },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#003366',
  },
  list: { flex: 1, marginBottom: 16 },
  empty: { textAlign: 'center', color: '#888', marginTop: 20 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: { flex: 1, fontSize: 16 },
  addButton: {
    backgroundColor: '#003366',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginLeft: 8,
  },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
});
