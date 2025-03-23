import React from 'react';
import { render } from '@testing-library/react-native';
import PodcasterProfile from '../app/podcasterprofile';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Mock navigation hooks
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
}));

describe('PodcasterProfile Component', () => {
  beforeEach(() => {
    // Provide mock parameters
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      id: 'anythinggoes',
      podcaster: 'Emma Chamberlain',
      profileimgurl: 'https://example.com/profile.jpg',
      headerurl: 'https://example.com/header.jpg',
      bio: 'Emma is a lifestyle podcaster with a global Gen Z following.',
      imageurl: 'https://example.com/podcast.jpg',
    });

    // Mock router functions
    (useRouter as jest.Mock).mockReturnValue({
      back: jest.fn(),
      push: jest.fn(),
    });
  });

  it('renders podcaster profile page correctly', () => {
    const { getByText, getByRole, getAllByText } = render(<PodcasterProfile />);

    // Check for podcaster name
    expect(getByText('Emma Chamberlain')).toBeTruthy();

    // Check for Follow button
    expect(getByText('Follow')).toBeTruthy();

    // Check for "Popular Episodes" title
    expect(getByText('Popular Episodes')).toBeTruthy();

    // Check for "See all episodes" button
    expect(getByText('See all episodes')).toBeTruthy();
  });
});
