import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import PodcastPlayer from "../app/podcastplayer"; // Ensure the correct path to your PodcastPlayer component
import { useLocalSearchParams, useRouter } from "expo-router";

// Mock `expo-router`
jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

describe("PodcastPlayer Component", () => {
  let mockRouterBack: jest.Mock;

  beforeEach(() => {
    // Mock navigation
    mockRouterBack = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ back: mockRouterBack });

    // Mock params
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      name: "Ascend",
      audioFile: "https://youtu.be/s9lwReXUtWE?si=Xs5iJ_OeViqKq_BD",
      time: "33:31",
      imageurl: "https://i.scdn.co/image/ab6765630000ba8ac695dcc95867a30a033cb985",
      podcaster: "Alex & Lokelani Wilson",
      profileimgurl: "https://yt3.googleusercontent.com/S3PPHdYFvywKgrqvtUTOOPy4qpXdC4P2zEgBTEiWRoVvzBZ0nuZBr1zrwpfvdBzNwSCNjtZTfQ=s900-c-k-c0x00ffffff-no-rj",
    });
  });

  it("renders all elements correctly", () => {
    const { getByText, getByTestId } = render(<PodcastPlayer />);

    // Check if the podcast title is displayed
    expect(getByText("Ascend")).toBeTruthy();

    // Check if the podcaster's name is displayed
    expect(getByText("by Alex & Lokelani WIlson")).toBeTruthy();
  });

  it("navigates back when the back button is pressed", () => {
    const { getByTestId } = render(<PodcastPlayer />);

    // Simulate pressing the back button
    fireEvent.press(getByTestId("back-button"));

    // Check if navigation back was triggered
    expect(mockRouterBack).toHaveBeenCalled();
  });

  it("toggles play and pause", () => {
    const { getByTestId } = render(<PodcastPlayer />);

    const playPauseButton = getByTestId("play-pause-button");

    // Simulate pressing play
    fireEvent.press(playPauseButton);
    expect(playPauseButton.props.name).toBe("pause-circle"); // Should now be paused

    // Simulate pressing pause
    fireEvent.press(playPauseButton);
    expect(playPauseButton.props.name).toBe("play-circle"); // Should now be playing
  });

  it("updates the slider value when changed", () => {
    const { getByTestId } = render(<PodcastPlayer />);

    const slider = getByTestId("audio-slider");

    // Simulate changing the slider value
    fireEvent(slider, "onValueChange", 200);

    // Ensure the slider reflects the new value
    expect(slider.props.value).toBe(200);
  });

  it("displays correct formatted time", () => {
    const { getByText } = render(<PodcastPlayer />);

    // Ensure the formatted current time and duration are displayed
    expect(getByText("0:00")).toBeTruthy();
    expect(getByText("33:31")).toBeTruthy();
  });
});
