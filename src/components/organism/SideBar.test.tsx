import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SideBar from "@/components/organism/SideBar";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { fetchNotebooks, createNotebook } from "@/redux/notebookSlice";

// Mock dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/redux/hooks", () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock("@/redux/notebookSlice", () => ({
  fetchNotebooks: jest.fn(() => ({ type: "FETCH_NOTEBOOKS" })),
  createNotebook: jest.fn((payload) => ({ type: "CREATE_NOTEBOOK", payload })),
}));

jest.mock("../molecule/NoteList", () => () => (
  <div data-testid="note-list">NoteList Component</div>
));

describe("SideBar Component", () => {
  const mockDispatch = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  it("dispatches fetchNotebooks on mount", () => {
    (useAppSelector as jest.Mock).mockReturnValue({ list: [], loading: false });
    render(<SideBar />);
    expect(mockDispatch).toHaveBeenCalledWith(fetchNotebooks());
  });

  it("renders 'Loading...' when loading is true", () => {
    (useAppSelector as jest.Mock).mockReturnValue({ list: [], loading: true });
    render(<SideBar />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders 'No notebooks yet' when list is empty", () => {
    (useAppSelector as jest.Mock).mockReturnValue({ list: [], loading: false });
    render(<SideBar />);
    expect(screen.getByText("No notebooks yet")).toBeInTheDocument();
  });

  it("renders NoteList when notebooks exist", () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      list: [{ _id: "1", title: "Note 1" }],
      loading: false,
    });
    render(<SideBar />);
    expect(screen.getByTestId("note-list")).toBeInTheDocument();
  });

  it("calls router.push('/login') when login button is clicked", () => {
    (useAppSelector as jest.Mock).mockReturnValue({ list: [], loading: false });
    render(<SideBar />);
    const loginButton = screen.getByText("Login");
    fireEvent.click(loginButton);
    expect(mockPush).toHaveBeenCalledWith("/login");
  });


});
