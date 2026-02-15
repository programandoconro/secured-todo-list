import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Todos } from '../screens/todos';
import { Login } from '../screens/login';
import { useApp } from './hooks';
import { JSX } from 'react';

export const App = (): JSX.Element => {
  const { isAuthenticated, handleAuthentication } = useApp();

  return (
    <SafeAreaProvider>
      {isAuthenticated ? <Todos /> : <Login onRetry={handleAuthentication} />}
    </SafeAreaProvider>
  );
};
