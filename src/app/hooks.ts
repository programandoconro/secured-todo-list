import { useState, useRef, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';

export const useApp = () => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const hasRunAuth = useRef(false);

  const handleAuthentication = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate',
      disableDeviceFallback: false,
    });

    if (result.success) {
      setAuthenticated(true);
    }
  };
  useEffect(() => {
    // prevent double-run in StrictMode
    if (hasRunAuth.current) return;
    hasRunAuth.current = true;

    handleAuthentication();
  }, []);

  return {
    handleAuthentication,
    isAuthenticated,
  };
};
