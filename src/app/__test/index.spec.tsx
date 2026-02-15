import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { App } from '..';
import { useApp } from '../hooks'; // Import this to typecast and control the mock

// 1. Mock the Hook with a dynamic response
jest.mock('../hooks', () => ({
  useApp: jest.fn(),
}));

// 2. Mock Screens as strings for light-weight rendering
jest.mock('../../screens/todos', () => ({
  Todos: () => 'TodosScreen',
}));
jest.mock('../../screens/login', () => ({
  Login: () => 'LoginScreen',
}));

// 3. Mock Safe Area Context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  return {
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement('React.Fragment', null, children),
  };
});

describe('App Component', () => {
  const mockedUseApp = useApp as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Login screen when not authenticated', async () => {
    // Set the mock state for this specific test
    mockedUseApp.mockReturnValue({
      isAuthenticated: false,
      handleAuthentication: jest.fn(),
    });

    let renderer: any;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<App />);
    });

    const tree = renderer.toJSON();
    expect(JSON.stringify(tree)).toContain('LoginScreen');
    expect(JSON.stringify(tree)).not.toContain('TodosScreen');
  });

  test('renders Todos screen when authenticated', async () => {
    // Toggle the mock state to true
    mockedUseApp.mockReturnValue({
      isAuthenticated: true,
      handleAuthentication: jest.fn(),
    });

    let renderer: any;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<App />);
    });

    const tree = renderer.toJSON();
    expect(JSON.stringify(tree)).toContain('TodosScreen');
    expect(JSON.stringify(tree)).not.toContain('LoginScreen');
  });
});
