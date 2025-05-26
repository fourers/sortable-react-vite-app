import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { expect, vi } from "vitest";
import { ReportMenu } from "./ReportMenu";


describe("ReportMenu", () => {
    // Mock AddButton to isolate ReportMenu logic
    vi.mock("./AddButton", () => ({
        AddButton: (props) => (
            <button onClick={() => {
                props.setIsEditMode(true);
                props.setCurrentReportId(null);
            }}>Add Report</button>
        ),
    }));

    const reports = [
        { id: 1, display_name: "Report One" },
        { id: 2, display_name: "Report Two" },
    ];

    let fetchMock;

    beforeEach(() => {
        vi.resetAllMocks();
        fetchMock = vi.spyOn(globalThis, "fetch");
    });

    it("renders AddButton and all reports", () => {
        render(
            <ReportMenu
                reports={reports}
                setCurrentReportId={vi.fn()}
                setIsEditMode={vi.fn()}
                setReports={vi.fn()}
            />
        );
        expect(screen.getByText("Add Report")).toBeInTheDocument();
        expect(screen.getByText("Report One")).toBeInTheDocument();
        expect(screen.getByText("Report Two")).toBeInTheDocument();
    });

    it("shows 'No reports yet' if reports is empty", () => {
        render(
            <ReportMenu
                reports={[]}
                setCurrentReportId={vi.fn()}
                setIsEditMode={vi.fn()}
                setReports={vi.fn()}
            />
        );
        expect(screen.getByText("No reports yet")).toBeInTheDocument();
    });

    it("calls setCurrentReportId and setIsEditMode when edit button is clicked", () => {
        const setCurrentReportId = vi.fn();
        const setIsEditMode = vi.fn();
        render(
            <ReportMenu
                reports={reports}
                setCurrentReportId={setCurrentReportId}
                setIsEditMode={setIsEditMode}
                setReports={vi.fn()}
            />
        );
        // There are two edit buttons (one per report)
        const editButtons = screen.getAllByLabelText("Edit Report");
        expect(editButtons).toHaveLength(2);
        // Click the first edit button
        fireEvent.click(editButtons[0]);
        expect(setCurrentReportId).toHaveBeenCalledWith(1);
        expect(setIsEditMode).toHaveBeenCalledWith(true);
    });

    it("calls setReports to remove report after successful delete", async () => {
        const setReports = vi.fn();
        fetchMock.mockResolvedValue({ ok: true });

        render(
            <ReportMenu
                reports={reports}
                setCurrentReportId={vi.fn()}
                setIsEditMode={vi.fn()}
                setReports={setReports}
            />
        );
        // There are two delete buttons (one per report), last column
        const deleteButtons = screen.getAllByLabelText("Delete Report");
        expect(deleteButtons).toHaveLength(2);
        // Click the second delete button
        fireEvent.click(deleteButtons[1]);
        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledTimes(1);
            // Check if the correct endpoint was called
            expect(fetchMock).toHaveBeenCalledWith("/api/reports/2", {method: "DELETE"});
        });
        expect(setReports).toHaveBeenCalled();
        const updater = setReports.mock.calls[0][0];
        expect(updater(reports)).toEqual([{ id: 1, display_name: "Report One" }]);
    });

    it("handles error if delete fails", async () => {
        const setReports = vi.fn();
        fetchMock.mockResolvedValue({ ok: false });

        render(
            <ReportMenu
                reports={reports}
                setCurrentReportId={vi.fn()}
                setIsEditMode={vi.fn()}
                setReports={setReports}
            />
        );
        const deleteButtons = screen.getAllByLabelText("Delete Report");
        expect(deleteButtons).toHaveLength(2);
        fireEvent.click(deleteButtons[0]);
        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledTimes(1);
            expect(fetchMock).toHaveBeenCalledWith("/api/reports/1", { method: "DELETE" });
        });
        expect(setReports).not.toHaveBeenCalled();
    });
});