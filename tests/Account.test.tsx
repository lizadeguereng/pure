import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Account from '../app/account';
import { auth, db } from '../firebaseConfig';
import { ref, get } from 'firebase/database';

// Mock firebaseConfig exports
jest.mock('../firebaseConfig', () => ({
  auth: { currentUser: { uid: '123' } },
  db: {},
}));

// Mock firebase/database functions
jest.mock('firebase/database', () => ({
  ref: jest.fn(),
  get: jest.fn(),
}));

// Mock expo-router useRouter
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('Account Component', () => {
  const mockUserData = {
    name: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
    profileimgurl: 'http://example.com/image.png',
  };

  beforeEach(() => {
    // Reset mocks
    (get as jest.Mock).mockResolvedValue({
      exists: () => true,
      val: () => mockUserData,
    });
    jest.clearAllMocks();
  });

  it('fetches and displays user data', async () => {
    const { getByText, getByRole } = render(<Account />);

    // Wait for useEffect to complete
    await waitFor(() => {
      expect(get).toHaveBeenCalledWith(ref(db, `users/${auth.currentUser.uid}`));
    });

    // Check that fetched data is displayed
    expect(getByText(`${mockUserData.name} Madison`)).toBeTruthy();
    expect(getByText(mockUserData.username)).toBeTruthy();
    expect(getByText(mockUserData.email)).toBeTruthy();

    // Profile image should have correct source
    const image = getByRole('image');
    expect(image.props.source.uri).toBe(mockUserData.profileimgurl);
  });

  it('navigates to home on logout', async () => {
    const { getByText } = render(<Account />);
    const logoutButton = getByText('Log out');

    fireEvent.press(logoutButton);

    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
