import { render, screen, fireEvent } from "@testing-library/react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import NoteItem from "./NoteItem";

// Mock Redux hooks and actions
jest.mock("@/redux/hooks", () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));


jest.mock("@/redux/notebookSlice", () => ({
  setSelectedNote: jest.fn(),
}));


jest.mock("@/redux/pageSlice", () => ({
  fetchPages: jest.fn(() => ({ type: "fetchPages" })),
  clearSelectedPage: jest.fn(() => ({ type: "clearSelectedPage" })),
  createPage: jest.fn(() => ({ type: "createPage" })),
}));

describe("NoteItem", () => {
    const mockDispatch = jest.fn();
    const mockNote = { _id: "note1", title: "My Note", pages: [] };
    const mockPages = [
        { _id: "page1", notebookId: "note1", title: "Page 1", content: "Content 1" },
        { _id: "page2", notebookId: "note1", title: "Page 2", content: "Content 2" },
    ];
    const mockToggleExpandNote = jest.fn();
    beforeEach(() => {
        (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
        (useAppSelector as jest.Mock).mockImplementation((selector) => {
            if (selector.name === "state") {
                return {
                    pages: {
                        list: mockPages,
                        loading: false,
                        error: null,
                    },
                };

            }
            return {};
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders NoteItem correctly", () => {
        render(

            <NoteItem
                note={mockNote}
                isExpanded={false}
                toggleExpandNote={mockToggleExpandNote}
            />

        );
        expect(screen.getByText("My Note")).toBeInTheDocument();
    });



});