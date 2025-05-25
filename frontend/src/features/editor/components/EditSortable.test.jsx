import "@testing-library/jest-dom";

import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act, useState } from "react";
import { expect, vi } from "vitest";

import { EditSortable } from "./EditSortable";

describe("EditSortable", () => {
    const selectedOptions = [
        { column: "col1", selected_name: "Name 1" },
        { column: "col2", selected_name: "Name 2" },
    ];
    const reportOptions = [
        { column: "col1", display_name: "Display 1" },
        { column: "col2", display_name: "Display 2" },
    ];

    it("renders all selected options with correct display names", () => {
        render(
            <EditSortable
                selectedOptions={selectedOptions}
                setSelectedOptions={vi.fn()}
                reportOptions={reportOptions}
            />,
        );
        expect(screen.getByDisplayValue("Name 1")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Name 2")).toBeInTheDocument();
        expect(screen.getByText("Display 1")).toBeInTheDocument();
        expect(screen.getByText("Display 2")).toBeInTheDocument();
    });

    it("calls setSelectedOptions when input is changed", () => {
        userEvent.setup();
        function TestWrapper({ selectedOptions, reportOptions }) {
            const [testSelectedOptions, testSetSelectedOptions] = useState(selectedOptions);
            return (
                <EditSortable
                    selectedOptions={testSelectedOptions}
                    setSelectedOptions={testSetSelectedOptions}
                    reportOptions={reportOptions}
                />
            );
        };
        render(
            <TestWrapper
                selectedOptions={selectedOptions}
                reportOptions={reportOptions}
            />,
        );
        const textField = screen.getByDisplayValue("Name 1");
        act(() => {
            userEvent.clear(textField);
        });
        expect(textField).toHaveValue("");
    });

    it("calls setSelectedOptions when CloseButton is clicked", () => {
        const setSelectedOptions = vi.fn();
        render(
            <EditSortable
                selectedOptions={selectedOptions}
                setSelectedOptions={setSelectedOptions}
                reportOptions={reportOptions}
            />,
        );
        // There are two CloseButtons, click the first one
        const closeButtons = screen.getAllByRole("button");
        fireEvent.click(closeButtons[0]);
        expect(setSelectedOptions).toHaveBeenCalled();

        const updater = setSelectedOptions.mock.calls.find(
            ([arg]) => typeof arg === "function",
        );
        expect(updater).toBeDefined();
        const result = updater[0]([...selectedOptions]);
        expect(result).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ column: "col2", selected_name: "Name 2" }),
            ]),
        );
    });
});
