import * as LocalAuthentication from 'expo-local-authentication';
import { useState, useRef, useEffect } from 'react';

export const useApp = () => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const hasRunAuth = useRef(false); // prevent double-run in StrictMode

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
    if (hasRunAuth.current) return;
    hasRunAuth.current = true;

    handleAuthentication();
  }, []);

  return {
    handleAuthentication,
    isAuthenticated,
  };
};
