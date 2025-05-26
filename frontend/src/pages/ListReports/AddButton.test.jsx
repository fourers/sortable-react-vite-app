import "@testing-library/jest-dom";

import { fireEvent,render, screen } from "@testing-library/react";
import { expect, vi } from "vitest";

import { AddButton } from "./AddButton";

describe("AddButton", () => {
    it("renders the Add Report button", () => {
        render(<AddButton setCurrentReportId={vi.fn()} setIsEditMode={vi.fn()} />);
        expect(screen.getByText("Add Report")).toBeInTheDocument();
    });

    it("calls setIsEditMode(true) and setCurrentReportId(null) when clicked", () => {
        const setCurrentReportId = vi.fn();
        const setIsEditMode = vi.fn();
        render(
            <AddButton
                setCurrentReportId={setCurrentReportId}
                setIsEditMode={setIsEditMode}
            />,
        );
        fireEvent.click(screen.getByText("Add Report"));
        expect(setIsEditMode).toHaveBeenCalledTimes(1);
        expect(setIsEditMode).toHaveBeenCalledWith(true);
        expect(setCurrentReportId).toHaveBeenCalledTimes(1);
        expect(setCurrentReportId).toHaveBeenCalledWith(null);
    });
});
