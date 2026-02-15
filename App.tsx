import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import { useState, useEffect, useRef } from 'react';

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      />
    </View>
  );
}
function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [authenticated, setAuthenticated] = useState(false);
  const hasRunAuth = useRef(false); // prevent double-run in StrictMode

  useEffect(() => {
    if (hasRunAuth.current) return;
    hasRunAuth.current = true;

    const authenticate = async () => {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate',
        disableDeviceFallback: false,
      });

      if (result.success) {
        setAuthenticated(true);
      }
    };

    authenticate();
  }, []);

  if (!authenticated) {
    // splash screen / block UI until auth
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
