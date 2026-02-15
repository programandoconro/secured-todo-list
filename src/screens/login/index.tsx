import React, { JSX } from 'react';
import { View, Button, StyleSheet } from 'react-native';

import { LoginScreenProps } from '../../model';

export const Login = ({ onRetry }: LoginScreenProps): JSX.Element => {
  return (
    <View style={[styles.container, styles.center]}>
      <Button title="Retry Login" onPress={onRetry} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, marginBottom: 20, textAlign: 'center' },
});
