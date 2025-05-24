import "@testing-library/jest-dom";

import { fireEvent,render, screen } from "@testing-library/react";
import { act } from "react";
import { vi } from "vitest";

import { EditDropdown } from "./EditDropdown";

describe("EditDropdown", () => {
    const filteredReportOptions = [
        { column: "col1", display_name: "Column 1" },
        { column: "col2", display_name: "Column 2" },
    ];

    it("renders the Add Column button", () => {
        render(
            <EditDropdown
                filteredReportOptions={filteredReportOptions}
                setSelectedOptions={vi.fn()}
            />,
        );
        expect(screen.getByText("Add Column")).toBeInTheDocument();
    });

    it("shows dropdown options when toggled", async () => {
        render(
            <EditDropdown
                filteredReportOptions={filteredReportOptions}
                setSelectedOptions={vi.fn()}
            />,
        );
        await act(async () => {
            fireEvent.click(screen.getByText("Add Column"));
        });
        expect(screen.getByText("Column 1")).toBeInTheDocument();
        expect(screen.getByText("Column 2")).toBeInTheDocument();
    });

    it("calls setSelectedOptions with correct value when an option is clicked", async () => {
        const setSelectedOptions = vi.fn();
        render(
            <EditDropdown
                filteredReportOptions={filteredReportOptions}
                setSelectedOptions={setSelectedOptions}
            />,
        );
        await act(async () => {
            fireEvent.click(screen.getByText("Add Column"));
        });
        await act(async () => {
            fireEvent.click(screen.getByText("Column 1"));
        });
        expect(setSelectedOptions).toHaveBeenCalled();

        const updater = setSelectedOptions.mock.calls[0][0];
        const prev = [];
        const result = updater(prev);
        expect(result).toEqual([
            { column: "col1", selected_name: "Column 1" },
        ]);
    });
});
