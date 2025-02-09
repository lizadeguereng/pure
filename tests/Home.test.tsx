import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Home from "../app/home"; // Ensure the correct path to your Home component
import { useRouter } from "expo-router";
import { get, ref } from "firebase/database";

// Mock `expo-router`
jest.mock("expo-router", () => ({
    useRouter: jest.fn(),
}));

// Mock Firebase functions
jest.mock("firebase/database", () => ({
    ref: jest.fn(),
    get: jest.fn(),
}));

describe("Home Component", () => {
    let mockRouterPush: jest.Mock;

    beforeEach(() => {
        // Mock navigation
        mockRouterPush = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });

        // Mock Firebase data
        (get as jest.Mock).mockResolvedValue({
            exists: () => true,
            val: () => ({
                podcast1: {
                    name: 'Amen Podcast',
                    imageurl: 'https://i.scdn.co/image/ab6765630000ba8ac695dcc95867a30a033cb985',
                    description: 'Preaching the good news of Jesus Christ and how it applies to everyday life.',
                    podcaster: 'Alex & Lokelani Wilson',
                    profileimgurl: 'https://yt3.googleusercontent.com/S3PPHdYFvywKgrqvtUTOOPy4qpXdC4P2zEgBTEiWRoVvzBZ0nuZBr1zrwpfvdBzNwSCNjtZTfQ=s900-c-k-c0x00ffffff-no-rj',
                },
            }),
        });
    });

    it("renders home screen elements correctly", async () => {
        const { getByText } = render(<Home />);

        // Check if greeting text is rendered
        expect(getByText("Good Afternoon,")).toBeTruthy();
        expect(getByText("Madison!")).toBeTruthy();

        // Wait for podcasts to load
        await waitFor(() => expect(get).toHaveBeenCalledTimes(1));
    });

    it("navigates to the podcast profile screen when a podcast is clicked", async () => {
        const { getByTestId, findByTestId } = render(<Home />);

        // Wait for podcast data to load
        const podcastItem = await findByTestId("podcast-item-1");

        // Simulate pressing the podcast item
        fireEvent.press(podcastItem);

        // Verify navigation with correct parameters
        expect(mockRouterPush).toHaveBeenCalledWith({
            pathname: "/podcastprofile",
            params: {
                name: 'Amen Podcast',
                imageurl: 'https://i.scdn.co/image/ab6765630000ba8ac695dcc95867a30a033cb985',
                description: 'Preaching the good news of Jesus Christ and how it applies to everyday life..',
                podcaster: 'Alex & Lokelani Wilson',
                profileimgurl: 'https://yt3.googleusercontent.com/S3PPHdYFvywKgrqvtUTOOPy4qpXdC4P2zEgBTEiWRoVvzBZ0nuZBr1zrwpfvdBzNwSCNjtZTfQ=s900-c-k-c0x00ffffff-no-rj',
            },
        });
    });

    it("navigates to the search page when search icon is pressed", () => {
        const { getByTestId } = render(<Home />);

        const searchButton = getByTestId("search-button");

        // Simulate pressing the search button
        fireEvent.press(searchButton);

        // Check navigation to the search page
        expect(mockRouterPush).toHaveBeenCalledWith("/search");
    });

    it("renders playback controls correctly", () => {
        const { getByTestId } = render(<Home />);

        // Check playback control buttons
        expect(getByTestId("rewind-button")).toBeTruthy();
        expect(getByTestId("play-button")).toBeTruthy();
        expect(getByTestId("fast-forward-button")).toBeTruthy();
    });

    it("shows an activity indicator while loading podcasts", () => {
        (get as jest.Mock).mockReturnValue(new Promise(() => { })); // Simulate loading state

        const { getByTestId } = render(<Home />);

        expect(getByTestId("loading-indicator")).toBeTruthy();
    });
});
