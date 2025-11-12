import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MainBar from "@/components/organism/MainBar";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  updatePage,
  updateSelectedPageLocal,
} from "@/redux/pageSlice";
import { updateNotebook } from "@/redux/notebookSlice";

jest.mock("@/redux/hooks", () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock("@/redux/pageSlice", () => ({
  updatePage: jest.fn((payload) => ({ type: "UPDATE_PAGE", payload })),
  updateSelectedPageLocal: jest.fn((payload) => ({
    type: "UPDATE_SELECTED_PAGE_LOCAL",
    payload,
  })),
}));

jest.mock("@/redux/notebookSlice", () => ({
  updateNotebook: jest.fn((payload) => ({ type: "UPDATE_NOTEBOOK", payload })),
}));

describe("MainBar Component", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    jest.clearAllMocks();
  });

  it("renders 'Select or create a note' when no selectedNote", () => {
    (useAppSelector as jest.Mock).mockImplementation((selector) =>
      selector({
        notebooks: { selectedNote: null },
        pages: { selectedPage: null, saving: false },
      })
    );

    render(<MainBar />);
    expect(screen.getByText("Select or create a note")).toBeInTheDocument();
  });

  it("renders message when note selected but no page", () => {
    (useAppSelector as jest.Mock).mockImplementation((selector) =>
      selector({
        notebooks: { selectedNote: { _id: "1", title: "My Note" } },
        pages: { selectedPage: null, saving: false },
      })
    );

    render(<MainBar />);
    expect(screen.getByText("Select or create a page within")).toBeInTheDocument();
    expect(screen.getByText("My Note")).toBeInTheDocument();
  });

  it("renders inputs when note and page are selected", () => {
    (useAppSelector as jest.Mock).mockImplementation((selector) =>
      selector({
        notebooks: { selectedNote: { _id: "1", title: "Note A" } },
        pages: {
          selectedPage: { _id: "p1", title: "Page A", content: "Hello" },
          saving: false,
        },
      })
    );

    render(<MainBar />);

    expect(screen.getByDisplayValue("Note A")).not.toBeNull(); 
    expect(screen.getByDisplayValue("Page A")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Hello")).toBeInTheDocument();
  });

  it("dispatches updateSelectedPageLocal when title changes", () => {
    (useAppSelector as jest.Mock).mockImplementation((selector) =>
      selector({
        notebooks: { selectedNote: { _id: "1", title: "Note A" } },
        pages: {
          selectedPage: { _id: "p1", title: "Page A", content: "Hello" },
          saving: false,
        },
      })
    );

    render(<MainBar />);
    const titleInput = screen.getByPlaceholderText("Page title...");
    fireEvent.change(titleInput, { target: { value: "Updated Title" } });

    expect(mockDispatch).toHaveBeenCalledWith(
      updateSelectedPageLocal({ title: "Updated Title" })
    );
  });

  it("dispatches updateSelectedPageLocal when content changes", () => {
    (useAppSelector as jest.Mock).mockImplementation((selector) =>
      selector({
        notebooks: { selectedNote: { _id: "1", title: "Note A" } },
        pages: {
          selectedPage: { _id: "p1", title: "Page A", content: "Hello" },
          saving: false,
        },
      })
    );

    render(<MainBar />);
    const textarea = screen.getByPlaceholderText("Write your notes here...");
    fireEvent.change(textarea, { target: { value: "Updated content" } });

    expect(mockDispatch).toHaveBeenCalledWith(
      updateSelectedPageLocal({ content: "Updated content" })
    );
  });

  it("dispatches updatePage on blur from inputs", () => {
    (useAppSelector as jest.Mock).mockImplementation((selector) =>
      selector({
        notebooks: { selectedNote: { _id: "1", title: "Note A" } },
        pages: {
          selectedPage: { _id: "p1", title: "Page A", content: "Hello" },
          saving: false,
        },
      })
    );

    render(<MainBar />);
    const titleInput = screen.getByPlaceholderText("Page title...");
    fireEvent.blur(titleInput);

    expect(mockDispatch).toHaveBeenCalledWith(
      updatePage({
        pageId: "p1",
        data: { title: "Page A", content: "Hello" },
      })
    );
  });

  it("shows 'Saving...' text when saving is true", () => {
    (useAppSelector as jest.Mock).mockImplementation((selector) =>
      selector({
        notebooks: { selectedNote: { _id: "1", title: "Note A" } },
        pages: {
          selectedPage: { _id: "p1", title: "Page A", content: "Hello" },
          saving: true,
        },
      })
    );

    render(<MainBar />);
    expect(screen.getByText("Saving...")).toBeInTheDocument();
  });

  it("switches to editable note title input on click", () => {
    (useAppSelector as jest.Mock).mockImplementation((selector) =>
      selector({
        notebooks: { selectedNote: { _id: "1", title: "Note A" } },
        pages: {
          selectedPage: { _id: "p1", title: "Page A", content: "Hello" },
          saving: false,
        },
      })
    );

    render(<MainBar />);
    const noteTitle = screen.getByText("Note A");
    fireEvent.click(noteTitle);
    const input = screen.getByDisplayValue("Note A");
    expect(input).toBeInTheDocument();
  });

  it("dispatches updateNotebook on note title blur with change", () => {
    (useAppSelector as jest.Mock).mockImplementation((selector) =>
      selector({
        notebooks: { selectedNote: { _id: "1", title: "Note A" } },
        pages: {
          selectedPage: { _id: "p1", title: "Page A", content: "Hello" },
          saving: false,
        },
      })
    );

    render(<MainBar />);
    const noteTitle = screen.getByText("Note A");
    fireEvent.click(noteTitle);

    const input = screen.getByDisplayValue("Note A");
    fireEvent.change(input, { target: { value: "Note A Updated" } });
    fireEvent.blur(input);

    expect(mockDispatch).toHaveBeenCalledWith(
      updateNotebook({ notebookId: "1", title: "Note A Updated" })
    );
  });
});
