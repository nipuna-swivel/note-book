import { render, screen, fireEvent } from "@testing-library/react";
import PageItem from "./PageItem";
import { useAppDispatch } from "../../redux/hooks";
import { setSelectedNote } from "@/redux/notebookSlice";
import { setSelectedPage, deletePage } from "@/redux/pageSlice";

// Mock Redux hooks and actions
jest.mock("@/redux/hooks", () => ({
  useAppDispatch: jest.fn(),
}));
jest.mock("@/redux/notebookSlice", () => ({
  setSelectedNote: jest.fn(),
}));
jest.mock("@/redux/pageSlice", () => ({
  setSelectedPage: jest.fn(),
  deletePage: jest.fn(),
}));

describe("PageItem", () => {
  const mockDispatch = jest.fn();

  const mockPage = {
    _id: "page1",
    title: "Page One",
    content: "Some content here",
    notebookId: "note1",
  };

  const mockNote = { _id: "note1", title: "My Note", pages: [mockPage] };

  beforeEach(() => {
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    jest.clearAllMocks();
  });

  it("renders page title correctly", () => {
    render(<PageItem page={mockPage} note={mockNote} />);
    expect(screen.getByText("Page One")).toBeInTheDocument();
  });

  it("dispatches setSelectedNote and setSelectedPage when clicked", () => {
    render(<PageItem page={mockPage} note={mockNote} />);
    const pageDiv = screen.getByText("Page One").closest("div");
    fireEvent.click(pageDiv!);

    expect(setSelectedNote).toHaveBeenCalledWith(mockNote);
    expect(setSelectedPage).toHaveBeenCalledWith(mockPage);
    expect(mockDispatch).toHaveBeenCalledTimes(2);
  });

  it("dispatches deletePage when delete button is clicked", () => {
    render(<PageItem page={mockPage} note={mockNote} />);
    const deleteButton = screen.getByRole("button");
    fireEvent.click(deleteButton);

    expect(deletePage).toHaveBeenCalledWith(mockPage._id);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it("does not call deletePage if page has no _id", () => {
    const pageWithoutId = { title: "Untitled" };
    render(<PageItem page={pageWithoutId as any} note={mockNote} />);
    const deleteButton = screen.getByRole("button");
    fireEvent.click(deleteButton);

    expect(deletePage).not.toHaveBeenCalled();
  });

  it("stops event propagation when deleting page", () => {
    const stopPropagation = jest.spyOn(Event.prototype, "stopPropagation");

    render(<PageItem page={mockPage} note={mockNote} />);

    const deleteButton = screen.getByRole("button");
    fireEvent.click(deleteButton);

    expect(stopPropagation).toHaveBeenCalled();

    stopPropagation.mockRestore();
  });
});
