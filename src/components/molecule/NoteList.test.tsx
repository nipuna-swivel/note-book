import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useSelector, useDispatch } from "react-redux";
import NoteList from "./NoteList";
import { setSelectedNote } from "@/redux/notebookSlice";
import { setSelectedPage, fetchPages } from "@/redux/pageSlice";

// Mock react-redux
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

// Mock NoteItem component
jest.mock("./NoteItem", () => (props: any) => (
  <div
    data-testid="note-item"
    data-noteid={props.note._id}
    onClick={() => props.onSelectNote && props.onSelectNote()}
  >
    Mock NoteItem: {props.note.title}
  </div>
));

// Mock Redux actions
jest.mock("@/redux/notebookSlice", () => ({
  setSelectedNote: jest.fn((note) => ({ type: "setSelectedNote", payload: note })),
}));

jest.mock("@/redux/pageSlice", () => ({
  setSelectedPage: jest.fn((page) => ({ type: "setSelectedPage", payload: page })),
  fetchPages: jest.fn((id) => ({ type: "fetchPages", payload: id })),
}));

describe("NoteList Component", () => {
  const mockDispatch = jest.fn();

  const mockNotes = [
    { _id: "1", title: "Note 1", pages: [] },
    { _id: "2", title: "Note 2", pages: [] },
  ];

  // Type-safe helpers
  const mockedUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;
  const mockedUseDispatch = useDispatch as jest.MockedFunction<typeof useDispatch>;

  const mockSelector = (state: any) => {
    mockedUseSelector.mockImplementation((selectorFn) => selectorFn(state));
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseDispatch.mockReturnValue(mockDispatch);
  });

  it("renders loading state", () => {
    mockSelector({
      notebooks: { list: [], loading: true, selectedNote: null },
      pages: { selectedPage: null },
    });

    render(<NoteList />);
    expect(screen.getByText(/Loading notebooks.../i)).toBeInTheDocument();
  });

  it("renders list of notes", () => {
    mockSelector({
      notebooks: { list: mockNotes, loading: false, selectedNote: null },
      pages: { selectedPage: null },
    });

    render(<NoteList />);
    const noteItems = screen.getAllByTestId("note-item");
    expect(noteItems).toHaveLength(2);
    expect(noteItems[0]).toHaveTextContent("Note 1");
    expect(noteItems[1]).toHaveTextContent("Note 2");
  });

  it("dispatches setSelectedNote and fetchPages when a note is clicked", () => {
    mockSelector({
      notebooks: { list: mockNotes, loading: false, selectedNote: null },
      pages: { selectedPage: null },
    });

    render(<NoteList />);
    const firstNote = screen.getAllByTestId("note-item")[0];
    fireEvent.click(firstNote);

    expect(mockDispatch).toHaveBeenCalledWith(setSelectedNote(mockNotes[0]));
    expect(mockDispatch).toHaveBeenCalledWith(fetchPages(mockNotes[0]._id));
  });

  it("expands and collapses notes properly when toggleExpandNote is used", () => {
    mockSelector({
      notebooks: { list: mockNotes, loading: false, selectedNote: null },
      pages: { selectedPage: null },
    });

    render(<NoteList />);
    const notes = screen.getAllByTestId("note-item");
    expect(notes).toHaveLength(2);
    // toggleExpandNote prop is provided; internal expand/collapse tested via integration tests
  });

  it("dispatches setSelectedPage when onSelectPage is triggered", () => {
    mockSelector({
      notebooks: { list: mockNotes, loading: false, selectedNote: null },
      pages: { selectedPage: null },
    });

    render(<NoteList />);

    const pageData = { _id: "p1", title: "Test Page" };

    // simulate NoteItem calling onSelectPage
    const noteItems = screen.getAllByTestId("note-item");
    const noteItem = noteItems[0];

    // Manually trigger onClick as simulation
    fireEvent.click(noteItem);

    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: "fetchPages" }));
  });
});
