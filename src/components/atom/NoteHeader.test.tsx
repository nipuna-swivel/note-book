import { render, screen, fireEvent } from "@testing-library/react";
import NoteHeader from "./NoteHeader";
import { useAppDispatch } from "../../redux/hooks";
import { setSelectedNote } from "@/redux/notebookSlice";

// Mock Redux hooks and actions
jest.mock("@/redux/hooks", () => ({
  useAppDispatch: jest.fn(),
}));
jest.mock("@/redux/notebookSlice", () => ({
  setSelectedNote: jest.fn(),
}));



describe("NoteHeader", () => {
    const mockDispatch = jest.fn();
    const mockNote = { _id: "note1", title: "My Note", pages: [] };
    const mockToggleExpandNote = jest.fn();


  it("renders note title correctly", () => {
    render(<NoteHeader note={mockNote} isExpanded={false} toggleExpandNote={function (noteId: number): void {
        throw new Error("Function not implemented.");
    } } />);
  });
});
