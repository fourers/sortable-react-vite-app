import "@testing-library/jest-dom";

import { fireEvent,render, screen } from "@testing-library/react";
import { afterEach, it, vi } from "vitest";

import { EditMode } from "./EditMode";


describe("EditMode", () => {
    // Mock child components to isolate EditMode logic
    vi.mock("./EditDropdown", () => ({
        EditDropdown: () => <div data-testid="edit-dropdown">EditDropdown</div>,
    }));
    vi.mock("./EditSortable", () => ({
        EditSortable: () => <div data-testid="edit-sortable">EditSortable</div>,
    }));
    vi.mock("./EditSubmit", () => ({
        EditSubmit: () => <button>Save</button>,
    }));

    const baseProps = {
        currentReportId: 1234,
        setCurrentReportId: vi.fn(),
        setIsEditMode: vi.fn(),
        setReports: vi.fn(),
        reportOptions: [
            { column: "col1", display_name: "Column 1" },
            { column: "col2", display_name: "Column 2" },
        ],
        selectedOptions: [
            { column: "col1", selected_name: "Name 1" },
        ],
        setSelectedOptions: vi.fn(),
        displayName: "Test Report",
        setDisplayName: vi.fn(),
        onBack: vi.fn(),
        onDelete: vi.fn(),
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders Back and Delete buttons", () => {
        render(<EditMode {...baseProps} />);
        expect(screen.getByText("Back")).toBeInTheDocument();
        expect(screen.getByLabelText("Delete Report")).toBeInTheDocument();
    });

    it("renders only Back button when currentReportId is null", () => {
        const props = { ...baseProps, currentReportId: null };
        render(<EditMode {...props} />);
        expect(screen.getByText("Back")).toBeInTheDocument();
        expect(screen.queryByLabelText("Delete Report")).not.toBeInTheDocument();
    });

    it("calls onBack when Back button is clicked", () => {
        render(<EditMode {...baseProps} />);
        fireEvent.click(screen.getByText("Back"));
        expect(baseProps.onBack).toHaveBeenCalled();
    });

    it("calls onDelete when Delete button is clicked", () => {
        render(<EditMode {...baseProps} />);
        const deleteButton = screen.getByLabelText("Delete Report");
        fireEvent.click(deleteButton);
        expect(baseProps.onDelete).toHaveBeenCalled();
    });

    it("renders the report name input and updates value", () => {
        render(<EditMode {...baseProps} />);
        const input = screen.getByPlaceholderText("Enter report name");
        expect(input).toHaveValue("Test Report");
        fireEvent.change(input, { target: { value: "New Name" } });
        expect(baseProps.setDisplayName).toHaveBeenCalledWith("New Name");
    });

    it("renders EditSortable and EditSubmit when there are selected options", () => {
        render(<EditMode {...baseProps} />);
        expect(screen.getByTestId("edit-sortable")).toBeInTheDocument();
        expect(screen.getByText("Save")).toBeInTheDocument();
    });

    it("does not render EditDropdown if all options are selected", () => {
        const props = {
            ...baseProps,
            selectedOptions: [
                { column: "col1", selected_name: "Name 1" },
                { column: "col2", selected_name: "Name 2" },
            ],
        };
        render(<EditMode {...props} />);
        expect(screen.queryByTestId("edit-dropdown")).not.toBeInTheDocument();
    });

    it("does not render EditSortable or EditSubmit if no selected options", () => {
        const props = { ...baseProps, selectedOptions: [] };
        render(<EditMode {...props} />);
        expect(screen.queryByTestId("edit-sortable")).not.toBeInTheDocument();
        expect(screen.queryByText("Save")).not.toBeInTheDocument();
    });
});
