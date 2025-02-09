import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PodcastProfile from '../app/podcastprofile';
import { useLocalSearchParams, router } from 'expo-router';
import { get, ref } from 'firebase/database';
import { db } from '../firebaseConfig';

// Mock dependencies
jest.mock('expo-router', () => ({
    useLocalSearchParams: jest.fn(),
    router: { push: jest.fn() },
}));

jest.mock('firebase/database', () => ({
    ref: jest.fn(),
    get: jest.fn(),
}));

// Mock data
const mockPodcastData = {
    name: 'Amen Podcast',
    imageurl: 'https://i.scdn.co/image/ab6765630000ba8ac695dcc95867a30a033cb985',
    description: 'Preaching the good news of Jesus Christ and how it applies to everyday life.',
    podcaster: 'Alex & Lokelani Wilson',
    profileimgurl: 'https://yt3.googleusercontent.com/S3PPHdYFvywKgrqvtUTOOPy4qpXdC4P2zEgBTEiWRoVvzBZ0nuZBr1zrwpfvdBzNwSCNjtZTfQ=s900-c-k-c0x00ffffff-no-rj',
};

const mockEpisodes = {
    episode1: {
        name: 'Ascend',
        audioFile: 'https://youtu.be/s9lwReXUtWE?si=Xs5iJ_OeViqKq_BD',
        description: 'Matthew 20: 17-19.',
        time: '33:31',
        imageurl: 'https://i.scdn.co/image/ab6765630000ba8ac695dcc95867a30a033cb985',
        profileimgurl: 'https://yt3.googleusercontent.com/S3PPHdYFvywKgrqvtUTOOPy4qpXdC4P2zEgBTEiWRoVvzBZ0nuZBr1zrwpfvdBzNwSCNjtZTfQ=s900-c-k-c0x00ffffff-no-rj',
        podcaster: 'Alex & Lokelani Wilson',
    },
};

// Test suite
describe('PodcastProfile Component', () => {
    beforeEach(() => {
        (useLocalSearchParams as jest.Mock).mockReturnValue(mockPodcastData);
        (get as jest.Mock).mockResolvedValue({ exists: () => true, val: () => mockEpisodes });
    });

    it('renders podcast profile correctly', async () => {
        const { getByText, getByPlaceholderText, getByTestId } = render(<PodcastProfile />);

        // Check if podcast title and description are rendered
        expect(getByText(mockPodcastData.name)).toBeTruthy();
        expect(getByText(mockPodcastData.description)).toBeTruthy();

        // Search Bar Test
        const searchInput = getByPlaceholderText('Search this podcast');
        expect(searchInput).toBeTruthy();

        // Check if search input is editable
        fireEvent.changeText(searchInput, 'AI');
        expect(searchInput.props.value).toBe('AI');

        // Check if episodes are being fetched
        await waitFor(() => expect(get).toHaveBeenCalledTimes(1));
    });

    it('navigates back when back button is pressed', () => {
        const { getByTestId } = render(<PodcastProfile />);
        const backButton = getByTestId('back-button');

        fireEvent.press(backButton);
        expect(router.push).toHaveBeenCalledWith('/home');
    });

    it('navigates to podcast player when episode is clicked', async () => {
        const { getByText, findByText } = render(<PodcastProfile />);

        // Ensure episodes are loaded
        await findByText(mockEpisodes.episode1.name);

        // Click episode
        fireEvent.press(getByText(mockEpisodes.episode1.name));

        expect(router.push).toHaveBeenCalledWith({
            pathname: '/podcastplayer',
            params: {
                name: 'Ascend',
                audioFile: 'https://youtu.be/s9lwReXUtWE?si=Xs5iJ_OeViqKq_BD',
                description: 'Matthew 20: 17-19.',
                time: '33:31',
                imageurl: 'https://i.scdn.co/image/ab6765630000ba8ac695dcc95867a30a033cb985',
                profileimgurl: 'https://yt3.googleusercontent.com/S3PPHdYFvywKgrqvtUTOOPy4qpXdC4P2zEgBTEiWRoVvzBZ0nuZBr1zrwpfvdBzNwSCNjtZTfQ=s900-c-k-c0x00ffffff-no-rj',
                podcaster: 'Alex & Lokelani Wilson',
            },
        });
    });
});
