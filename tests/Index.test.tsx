import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Index from '../app/index'; // Ensure the correct path to the Index component
import { useRouter } from 'expo-router';

// Mock the router with TypeScript
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

describe('Index Component', () => {
  let mockPush: jest.Mock;

  beforeEach(() => {
    // Mock the router's push method
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('renders the logo, tagline, and buttons correctly', () => {
    const { getByText } = render(<Index />);

    // Check that the logo and tagline are displayed
    expect(getByText('Purely about podcasts.')).toBeTruthy();

    // Check that the buttons are displayed
    expect(getByText('Sign up now')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
  });

  it('navigates to the register page when "Sign up now" is pressed', () => {
    const { getByText } = render(<Index />);

    // Simulate button press
    fireEvent.press(getByText('Sign up now'));

    // Check that the router.push method was called with the correct route
    expect(mockPush).toHaveBeenCalledWith('/register');
  });

  it('navigates to the login page when "Login" is pressed', () => {
    const { getByText } = render(<Index />);

    // Simulate button press
    fireEvent.press(getByText('Login'));

    // Check that the router.push method was called with the correct route
    expect(mockPush).toHaveBeenCalledWith('/login');
  });
});
