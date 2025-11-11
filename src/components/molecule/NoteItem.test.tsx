import { render, screen, fireEvent } from "@testing-library/react";
import NoteItem from "./NoteItem";
import NoteHeader from "../atom/NoteHeader";
import PageItem from "../atom/PageItem";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

// Mock Redux hooks and actions
jest.mock("@/redux/hooks", () => ({
  useAppDispatch: jest.fn(),
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
    {
      _id: "page1",
      notebookId: "note1",
      title: "Page 1",
      content: "Content 1",
    },
    {
      _id: "page2",
      notebookId: "note1",
      title: "Page 2",
      content: "Content 2",
    },
  ];
  const mockToggleExpandNote = jest.fn();

  it("renders NoteHeader correctly", () => {
    render(
      <NoteHeader
        note={mockNote}
        isExpanded={false}
        toggleExpandNote={mockToggleExpandNote}
      />
    );
    expect(screen.getByText("My Note")).toBeInTheDocument();
  });

  it("renders PageItem when expanded", () => {
    render(
      <PageItem
        note={mockNote}
        page={mockPages}
        isExpanded={true}
        toggleExpandNote={mockToggleExpandNote}
      />
    );
  });

  it("creates a new page when add button is clicked", () => {
    render(
      <NoteItem
        note={mockNote}
        isExpanded={true}
        toggleExpandNote={mockToggleExpandNote}
      />
    );
    const addButton = screen.getByRole("button", { name: /Add Page/i });
    fireEvent.click(addButton);
    expect(mockDispatch).toHaveBeenCalled();
  });
});
