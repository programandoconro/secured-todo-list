export const STORAGE_KEY = '@todos_list';

export type Todo = {
  id: string;
  text: string;
  done: boolean;
};

export type ItemType = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
};

export type LoginScreenProps = {
  onRetry: () => void;
};
