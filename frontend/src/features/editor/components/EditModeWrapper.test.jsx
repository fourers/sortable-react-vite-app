import "@testing-library/jest-dom";

import { fireEvent,render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import { expect, vi } from "vitest";

import { EditModeWrapper } from "./EditModeWrapper";


describe("EditModeWrapper", () => {
    // Mock EditMode to observe props and simulate UI
    vi.mock("./EditMode", () => ({
        EditMode: (props) => (
            <div>
                <button onClick={props.onBack}>Back</button>
                <button onClick={props.onDelete}>Delete</button>
                <div data-testid="displayName">{props.displayName}</div>
                <div data-testid="selectedOptions">{JSON.stringify(props.selectedOptions)}</div>
                <div data-testid="reportOptions">{JSON.stringify(props.reportOptions)}</div>
            </div>
        ),
    }));

    let fetchMock;
    const setCurrentReportId = vi.fn();
    const setIsEditMode = vi.fn();
    const setReports = vi.fn();

    beforeEach(() => {
        vi.resetAllMocks();
        fetchMock = vi.spyOn(globalThis, "fetch");
    });

    it("fetches report data when currentReportId is set", async () => {
        fetchMock.mockImplementation((url) => {
            if (url === "/api/reports/options") {
                return Promise.resolve({
                    ok: true,
                    json: async () => [{ column: "col1", display_name: "Column 1" }],
                });
            } else if (url === "/api/reports/42") {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({
                        display_name: "Loaded Report",
                        selected_options: [{ column: "col1", selected_name: "Name 1" }],
                    }),
                });
            }
        });

        render(
            <EditModeWrapper
                currentReportId={42}
                setCurrentReportId={setCurrentReportId}
                setIsEditMode={setIsEditMode}
                setReports={setReports}
            />,
        );
        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledTimes(2);
            expect(fetchMock).toHaveBeenCalledWith("/api/reports/options");
            expect(fetchMock).toHaveBeenCalledWith("/api/reports/42");
        });
        expect(screen.getByTestId("reportOptions").textContent).toContain("Column 1");
        expect(screen.getByTestId("displayName").textContent).toContain("Loaded Report");
        expect(screen.getByTestId("selectedOptions").textContent).toContain("Name 1");
    });

    it("fetches only report options when currentReportId is null", async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => [{ column: "col1", display_name: "Column 1" }],
        });

        render(
            <EditModeWrapper
                currentReportId={null}
                setCurrentReportId={setCurrentReportId}
                setIsEditMode={setIsEditMode}
                setReports={setReports}
            />,
        );
        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledTimes(1);
            expect(fetchMock).toHaveBeenCalledWith("/api/reports/options");
        });
        expect(screen.getByTestId("reportOptions").textContent).toContain("Column 1");
        expect(screen.getByTestId("displayName").textContent).toBe("");
        expect(screen.getByTestId("selectedOptions").textContent).toBe("[]");
    });

    it("calls setCurrentReportId and setIsEditMode on back", async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        render(
            <EditModeWrapper
                currentReportId={null}
                setCurrentReportId={setCurrentReportId}
                setIsEditMode={setIsEditMode}
                setReports={setReports}
            />,
        );
        await act(async () => {
            fireEvent.click(screen.getByText("Back"));
        });
        expect(setCurrentReportId).toHaveBeenCalledWith(null);
        expect(setIsEditMode).toHaveBeenCalledWith(false);
    });

    it("calls setReports and setIsEditMode on delete", async () => {
        fetchMock
            .mockResolvedValue({
                ok: true,
                json: async () => [],
            });

        render(
            <EditModeWrapper
                currentReportId={123}
                setCurrentReportId={setCurrentReportId}
                setIsEditMode={setIsEditMode}
                setReports={setReports}
            />,
        );
        fireEvent.click(screen.getByText("Delete"));
        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledTimes(3); // 2 fetches for options and report, 1 for delete
            expect(fetchMock).toHaveBeenCalledWith("/api/reports/123", {
                method: "DELETE",
            });
        });
        expect(setReports).toHaveBeenCalled();
        const updater = setReports.mock.calls[0][0];
        const result = updater([{ id: 123, display_name: "Test Report" }, { id: 124, display_name: "Test Report 2" }]);
        expect(result).toEqual([{ id: 124, display_name: "Test Report 2" }]);
        expect(setIsEditMode).toHaveBeenCalledWith(false);
    });

    it("handles fetch errors gracefully", async () => {
        fetchMock.mockResolvedValueOnce({
            ok: false,
            json: async () => [],
        });

        render(
            <EditModeWrapper
                currentReportId={null}
                setCurrentReportId={setCurrentReportId}
                setIsEditMode={setIsEditMode}
                setReports={setReports}
            />,
        );

        // Should not throw, just log error
        await waitFor(() => {
            expect(screen.getByTestId("reportOptions").textContent).toBe("[]");
            expect(screen.getByTestId("selectedOptions").textContent).toBe("[]");
        });
    });
});
