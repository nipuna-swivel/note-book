import { render, screen, fireEvent } from "@testing-library/react";
import NoteHeader from "./NoteHeader";
import { useAppDispatch } from "../../redux/hooks";


// Mock Redux hooks and actions
jest.mock("@/redux/hooks", () => ({
  useAppDispatch: jest.fn(),
}));
jest.mock("@/redux/notebookSlice", () => ({
  setSelectedNote: jest.fn(),
  deleteNotebook: jest.fn(() => ({ type: "deleteNotebook" })),
}));

describe("NoteHeader", () => {
  const mockDispatch = jest.fn();
  const mockNote = { _id: "note1", title: "My Note", pages: [] };
  const mockToggleExpandNote = jest.fn();

  it("renders note title correctly", () => {
    render(
      <NoteHeader
        note={mockNote}
        isExpanded={false}
        toggleExpandNote={function (noteId: number): void {
          throw new Error("Function not implemented.");
        }}
      />
    );
  });

  it("calls toggleExpandNote when header is clicked", () => {
    render(
      <NoteHeader
        note={mockNote}
        isExpanded={false}
        toggleExpandNote={mockToggleExpandNote}
      />
    );
    const headerDiv = screen.getByText("My Note").closest("div");
    fireEvent.click(headerDiv!);
    expect(mockToggleExpandNote).toHaveBeenCalledWith(Number(mockNote._id));
  });

  it("dispatches deleteNotebook when delete button is clicked", () => {
    // Mock Redux dispatch
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);

    // Spy on stopPropagation globally
    const stopPropagation = jest.spyOn(Event.prototype, "stopPropagation");

    render(
      <NoteHeader
        note={mockNote}
        isExpanded={false}
        toggleExpandNote={mockToggleExpandNote}
      />
    );

    // Select the delete button
    const deleteButton = screen.getByRole("button");

    // Simulate click
    fireEvent.click(deleteButton);

    // Assertions
    expect(stopPropagation).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledTimes(1);

    // Cleanup
    stopPropagation.mockRestore();
  });
});
