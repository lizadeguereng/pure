import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../app/login'; // Ensure the correct path to the LoginScreen component
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { db } from '../firebaseConfig'; // Mocked Firebase config
import { get, ref, child } from 'firebase/database';

// Mock Firebase functions
jest.mock('firebase/database', () => ({
  ref: jest.fn(),
  child: jest.fn(),
  get: jest.fn(),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// Mock the Alert API
jest.spyOn(Alert, 'alert');

describe('LoginScreen', () => {
  let mockRouterPush: jest.Mock;

  beforeEach(() => {
    mockRouterPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
  });

  it('renders all elements correctly', () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    // Check for username and password input fields
    expect(getByPlaceholderText('Enter your username')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();

    // Check for buttons
    expect(getByText('Sign in')).toBeTruthy();
    expect(getByText('New Here?')).toBeTruthy();
  });

  it('shows an alert when username or password is missing', async () => {
    const { getByText } = render(<LoginScreen />);

    // Simulate clicking the Sign-in button with empty fields
    fireEvent.press(getByText('Sign in'));

    // Check if Alert.alert was called with the correct message
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter both username and password.');
  });

  it('navigates to the register page when "New Here?" is pressed', () => {
    const { getByText } = render(<LoginScreen />);

    // Simulate pressing the "New Here?" button
    fireEvent.press(getByText('New Here?'));

    // Check if the router.push method was called with "/register"
    expect(mockRouterPush).toHaveBeenCalledWith('/register');
  });

  it('shows success alert when Firebase connection is successful', async () => {
    // Mock Firebase returning a valid snapshot
    (get as jest.Mock).mockResolvedValue({
      exists: () => true,
      val: () => ({ user1: { username: 'root', password: 'root' } }),
    });

    const { getByText } = render(<LoginScreen />);

    // Call the testFirebaseConnection function
    await waitFor(() => fireEvent.press(getByText('Sign in')));

    // Check if the alert for Firebase success is shown
    expect(Alert.alert).toHaveBeenCalledWith('Firebase Test', 'Successfully connected to Firebase!');
  });

  it('shows error alert when Firebase connection fails', async () => {
    // Mock Firebase returning no data
    (get as jest.Mock).mockResolvedValue({
      exists: () => false,
    });

    const { getByText } = render(<LoginScreen />);

    // Call the testFirebaseConnection function
    await waitFor(() => fireEvent.press(getByText('Sign in')));

    // Check if the alert for no data is shown
    expect(Alert.alert).toHaveBeenCalledWith('Firebase Test', 'No data found in the database.');
  });

  it('navigates to the home page on successful login', async () => {
    // Mock Firebase returning valid user data
    (get as jest.Mock).mockResolvedValue({
      exists: () => true,
      val: () => ({
        user1: { username: 'root', password: 'root' },
      }),
    });

    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    // Simulate entering username and password
    fireEvent.changeText(getByPlaceholderText('Enter your username'), 'root');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'root');

    // Simulate pressing the Sign-in button
    await waitFor(() => fireEvent.press(getByText('Sign in')));

    // Check if navigation to '/home' was triggered
    expect(mockRouterPush).toHaveBeenCalledWith('/home');
  });

  it('shows alert for invalid username or password', async () => {
    // Mock Firebase returning user data without matching credentials
    (get as jest.Mock).mockResolvedValue({
      exists: () => true,
      val: () => ({
        user1: { username: 'wronguser', password: 'wrongpassword' },
      }),
    });

    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    // Simulate entering username and password
    fireEvent.changeText(getByPlaceholderText('Enter your username'), 'root');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'root');

    // Simulate pressing the Sign-in button
    await waitFor(() => fireEvent.press(getByText('Sign in')));

    // Check if alert for invalid credentials is shown
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Invalid username or password. Please try again.');
  });
});
