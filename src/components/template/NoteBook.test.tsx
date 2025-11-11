import React from "react";
import { render, screen } from "@testing-library/react";
import NoteBook from "@/components/template/NoteBook";

// Mock child components
jest.mock("../organism/SideBar", () => () => <div data-testid="sidebar">SideBar</div>);
jest.mock("../organism/MainBar", () => () => <div data-testid="mainbar">MainBar</div>);

describe("NoteBook Component", () => {
  it("renders without crashing", () => {
    render(<NoteBook />);
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("mainbar")).toBeInTheDocument();
  });

  it("renders with correct layout classes", () => {
    const { container } = render(<NoteBook />);
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper).toHaveClass("flex");
    expect(wrapper).toHaveClass("flex-col");
    expect(wrapper).toHaveClass("md:flex-row");
    expect(wrapper).toHaveClass("h-screen");
    expect(wrapper).toHaveClass("bg-gray-50");
  });
});
