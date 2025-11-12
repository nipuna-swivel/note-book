import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import NoteItem from "./NoteItem";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createPage, fetchPages, clearSelectedPage } from "@/redux/pageSlice";
import { setSelectedNote } from "@/redux/notebookSlice";

// Mock redux hooks
jest.mock("@/redux/hooks", () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

// Mock redux actions
jest.mock("@/redux/notebookSlice", () => ({
  setSelectedNote: jest.fn((note) => ({ type: "setSelectedNote", payload: note })),
}));

jest.mock("@/redux/pageSlice", () => ({
  fetchPages: jest.fn((id) => ({ type: "fetchPages", payload: id })),
  clearSelectedPage: jest.fn(() => ({ type: "clearSelectedPage" })),
  createPage: jest.fn((data) => ({ type: "createPage", payload: data })),
}));

// Mock child components
jest.mock("@/components/atom/PageItem", () => () => <div>Mock PageItem</div>);
jest.mock("@/components/atom/NoteHeader", () => () => (
  <div data-testid="note-header">Mock NoteHeader</div>
));

describe("NoteItem Component", () => {
  const mockDispatch = jest.fn();
  const mockNote = { _id: "note1", title: "My Note", pages: [] };
  const mockToggleExpandNote = jest.fn();

  // Type-safe mocks
  const mockedUseDispatch = useAppDispatch as jest.MockedFunction<typeof useAppDispatch>;
  const mockedUseSelector = useAppSelector as jest.MockedFunction<typeof useAppSelector>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseDispatch.mockReturnValue(mockDispatch);
  });

  const setupSelector = (state: any) => {
    mockedUseSelector.mockReturnValue(state);
  };

  const mockNoteItemProps = {
  note: mockNote,
  isExpanded: true,
  toggleExpandNote: jest.fn(),
  handleAddPage: jest.fn(),
  handleDeleteNote: jest.fn(),
  handleDeletePage: jest.fn(),
  setSelectedNote: jest.fn(),
  setSelectedPage: jest.fn(),
};

  it("renders NoteHeader always", () => {
    setupSelector({ list: [], loading: false, error: null });
    render(
      // <NoteItem
      //   note={mockNote}
      //   isExpanded={false}
      //   toggleExpandNote={mockToggleExpandNote}
      // />
      <NoteItem {...mockNoteItemProps} />
    );
    expect(screen.getByTestId("note-header")).toBeInTheDocument();
  });

  it("dispatches fetchPages when expanded", () => {
    setupSelector({ list: [], loading: false, error: null });
    render(
      // <NoteItem
      //   note={mockNote}
      //   isExpanded={true}
      //   toggleExpandNote={mockToggleExpandNote}
     // />
     <NoteItem {...mockNoteItemProps} />
    );
    expect(mockDispatch).toHaveBeenCalledWith(fetchPages(mockNote._id));
  });

  it("dispatches clearSelectedPage when collapsed", () => {
    setupSelector({ list: [], loading: false, error: null });
    render(
      // <NoteItem
      //   note={mockNote}
      //   isExpanded={false}
      //   toggleExpandNote={mockToggleExpandNote}
     // />
     <NoteItem {...mockNoteItemProps} />
    );
    expect(mockDispatch).toHaveBeenCalledWith(clearSelectedPage());
  });

  it("renders loading text", () => {
    setupSelector({ list: [], loading: true, error: null });
    render(
      // <NoteItem
      //   note={mockNote}
      //   isExpanded={true}
      //   toggleExpandNote={mockToggleExpandNote}
      // />
      <NoteItem {...mockNoteItemProps} />
    );
    expect(screen.getByText(/Loading pages/i)).toBeInTheDocument();
  });

  it("renders error message", () => {
    setupSelector({ list: [], loading: false, error: "Something went wrong" });
    render(
      // <NoteItem
      //   note={mockNote}
      //   isExpanded={true}
      //   toggleExpandNote={mockToggleExpandNote}
      // />
      <NoteItem {...mockNoteItemProps} />
    );
    expect(screen.getByText(/Error loading pages/i)).toBeInTheDocument();
  });

  it("renders PageItem when pages exist", () => {
    setupSelector({
      list: [
        { _id: "p1", notebookId: "note1", title: "Page 1", content: "" },
        { _id: "p2", notebookId: "note1", title: "Page 2", content: "" },
      ],
      loading: false,
      error: null,
    });
    render(
      // <NoteItem
      //   note={mockNote}
      //   isExpanded={true}
      //   toggleExpandNote={mockToggleExpandNote}
      // />
      <NoteItem {...mockNoteItemProps} />
    );
    expect(screen.getAllByText("Mock PageItem")).toHaveLength(2);
  });

  it("renders 'No pages yet.' when no pages", () => {
    setupSelector({ list: [], loading: false, error: null });
    render(
      // <NoteItem
      //   note={mockNote}
      //   isExpanded={true}
      //   toggleExpandNote={mockToggleExpandNote}
      // />
      <NoteItem {...mockNoteItemProps} />
    );
    expect(screen.getByText(/No pages yet./i)).toBeInTheDocument();
  });

  it("creates a new page when Add Page is clicked", () => {
    setupSelector({ list: [], loading: false, error: null });
    render(
      // <NoteItem
      //   note={mockNote}
      //   isExpanded={true}
      //   toggleExpandNote={mockToggleExpandNote}
      // />
      <NoteItem {...mockNoteItemProps} />
    );
    const addButton = screen.getByRole("button", { name: /Add Page/i });
    fireEvent.click(addButton);
    expect(mockDispatch).toHaveBeenCalledWith(
      createPage({
        notebookId: "note1",
        pageData: { title: "Page 1", content: "" },
      })
    );
  });
});
