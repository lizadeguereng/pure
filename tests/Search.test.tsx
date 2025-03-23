import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Search from '../app/search';
import { get } from 'firebase/database';
import { router } from 'expo-router';

// Mock Firebase DB
jest.mock('firebase/database', () => ({
  get: jest.fn(),
  ref: jest.fn(),
}));

// Mock Expo Router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

describe('Search Component', () => {
  beforeEach(() => {
    (get as jest.Mock).mockResolvedValue({
      exists: () => false,
    });
  });

  it('renders the search screen correctly', () => {
    const { getByPlaceholderText, getByText } = render(<Search />);

    expect(getByPlaceholderText('The gears are turning!')).toBeTruthy();
    expect(getByText('Recently Searched')).toBeTruthy();
  });

  it('displays "No results found" when there are no matches', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<Search />);

    const searchInput = getByPlaceholderText('The gears are turning!');
    fireEvent.changeText(searchInput, 'Test');

    await waitFor(() => {
      expect(getByText('Search Results')).toBeTruthy();
      expect(queryByText('No results found.')).toBeTruthy();
    });
  });

  it('updates search input text value', () => {
    const { getByPlaceholderText } = render(<Search />);
    const input = getByPlaceholderText('The gears are turning!');

    fireEvent.changeText(input, 'Podcast');
    expect(input.props.value).toBe('Podcast');
  });
});
