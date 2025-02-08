import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RegisterScreen from '../app/register'; // Ensure the correct import path
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ref, push, set } from 'firebase/database';

// Mock Firebase Realtime Database functions
jest.mock('firebase/database', () => ({
  ref: jest.fn(),
  push: jest.fn(() => ({
    key: 'testKey',
  })),
  set: jest.fn(),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('RegisterScreen', () => {
  let mockRouterPush: jest.Mock;

  beforeEach(() => {
    // Mock the router push function
    mockRouterPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
  });

  it('renders all elements correctly', () => {
    const { getByText, getByPlaceholderText } = render(<RegisterScreen />);

    // Check for the logo and title
    expect(getByText('Welcome to Pure!')).toBeTruthy();

    // Check for input fields
    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByPlaceholderText('Enter your name')).toBeTruthy();
    expect(getByPlaceholderText('Choose a username')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
    expect(getByPlaceholderText('Confirm your password')).toBeTruthy();

    // Check for buttons
    expect(getByText('Create account')).toBeTruthy();
    expect(getByText('Already a member?')).toBeTruthy();
  });

  it('shows an alert if fields are missing', async () => {
    const { getByText } = render(<RegisterScreen />);

    // Simulate clicking the Create account button with empty fields
    fireEvent.press(getByText('Create account'));

    // Verify alert is displayed for empty fields
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'All fields are required.');
  });

  it('shows an alert if passwords do not match', async () => {
    const { getByText, getByPlaceholderText } = render(<RegisterScreen />);

    // Fill in the fields with mismatched passwords
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your name'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('Choose a username'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm your password'), 'password456');

    // Simulate clicking the Create account button
    fireEvent.press(getByText('Create account'));

    // Verify alert is displayed for mismatched passwords
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Passwords do not match.');
  });

  it('calls Firebase set function with correct data on successful registration', async () => {
    const { getByText, getByPlaceholderText } = render(<RegisterScreen />);

    // Fill in all fields with valid data
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your name'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('Choose a username'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm your password'), 'password123');

    // Simulate clicking the Create account button
    await waitFor(() => fireEvent.press(getByText('Create account')));

    // Verify Firebase push and set are called with correct data
    expect(push).toHaveBeenCalledWith(ref(expect.anything(), 'users'));
    expect(set).toHaveBeenCalledWith(
      { key: 'testKey' },
      {
        email: 'test@example.com',
        name: 'Test User',
        username: 'testuser',
        password: 'password123',
      }
    );

    // Verify success alert
    expect(Alert.alert).toHaveBeenCalledWith('Success', 'User registered successfully!');
  });

  it('navigates to the login page after registration', async () => {
    const { getByText, getByPlaceholderText } = render(<RegisterScreen />);

    // Fill in all fields with valid data
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your name'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('Choose a username'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm your password'), 'password123');

    // Simulate clicking the Create account button
    await waitFor(() => fireEvent.press(getByText('Create account')));

    // Verify navigation to login page
    expect(mockRouterPush).toHaveBeenCalledWith('/login');
  });

  it('navigates to the login page when "Already a member?" is pressed', () => {
    const { getByText } = render(<RegisterScreen />);

    // Simulate clicking the Already a member? button
    fireEvent.press(getByText('Already a member?'));

    // Verify navigation to login page
    expect(mockRouterPush).toHaveBeenCalledWith('/login');
  });
});
