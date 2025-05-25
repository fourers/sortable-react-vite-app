import "@testing-library/jest-dom";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import { expect, vi } from "vitest";

import { EditSubmit } from "./EditSubmit";


describe("EditSubmit", () => {
    const setReports = vi.fn();
    const setCurrentReportId = vi.fn();
    const setIsEditMode = vi.fn();
    let fetchMock;

    beforeEach(() => {
        vi.resetAllMocks();
        fetchMock = vi.spyOn(globalThis, "fetch");
    });

    it("does not submit if selectedOptions is empty", () => {
        render(
            <EditSubmit
                selectedOptions={[]}
                displayName="Test Report"
                currentReportId={null}
                setCurrentReportId={setCurrentReportId}
                setReports={setReports}
                setIsEditMode={setIsEditMode}
            />,
        );
        fireEvent.click(screen.getByText("Save"));
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("submits new report (POST) and updates reports", async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ id: 1, display_name: "Test Report" }),
        });

        render(
            <EditSubmit
                selectedOptions={[{ column: "col1", selected_name: "Name 1" }]}
                displayName="Test Report"
                currentReportId={null}
                setCurrentReportId={setCurrentReportId}
                setReports={setReports}
                setIsEditMode={setIsEditMode}
            />,
        );
        await act(async () => {
            fireEvent.click(screen.getByText("Save"));
        });

        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledTimes(1);
            expect(fetchMock).toHaveBeenCalledWith(
                "/api/reports",
                expect.objectContaining({
                    method: "POST",
                    body: JSON.stringify({
                        display_name: "Test Report",
                        selected_options: [{ column: "col1", selected_name: "Name 1" }],
                    }),
                    headers: { "Content-Type": "application/json" },
                }),
            );
        });
        expect(setReports).toHaveBeenCalledWith(expect.any(Function));
        const updater = setReports.mock.calls[0][0];
        const result = updater([{ id: 0, display_name: "Initial Report" }]);
        expect(result).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: 0, display_name: "Initial Report" }),
                expect.objectContaining({ id: 1, display_name: "Test Report" }),
            ]),
        );
        expect(setCurrentReportId).not.toHaveBeenCalled();
        expect(setIsEditMode).toHaveBeenCalledWith(false);
    });

    it("submits update (PATCH) and updates reports", async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ id: 2, display_name: "Updated Report" }),
        });

        render(
            <EditSubmit
                selectedOptions={[{ column: "col2", selected_name: "Name 2" }]}
                displayName="Updated Report"
                currentReportId={2}
                setCurrentReportId={setCurrentReportId}
                setReports={setReports}
                setIsEditMode={setIsEditMode}
            />,
        );
        fireEvent.click(screen.getByText("Save"));

        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledTimes(1);
            expect(fetchMock).toHaveBeenCalledWith(
                "/api/reports/2",
                expect.objectContaining({
                    method: "PATCH",
                    body: JSON.stringify({
                        display_name: "Updated Report",
                        selected_options: [{ column: "col2", selected_name: "Name 2" }],
                    }),
                    headers: { "Content-Type": "application/json" },
                }),
            );
        });
        expect(setReports).toHaveBeenCalledWith(expect.any(Function));
        const updater = setReports.mock.calls[0][0];
        const result = updater([{ id: 1, display_name: "Initial Report" }, { id: 2, display_name: "Old Report" }]);
        expect(result).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: 1, display_name: "Initial Report" }),
                expect.objectContaining({ id: 2, display_name: "Updated Report" }),
            ]),
        );
        expect(setCurrentReportId).toHaveBeenCalledWith(null);
        expect(setIsEditMode).toHaveBeenCalledWith(false);
    });

    it("handles fetch error gracefully", async () => {
        fetchMock.mockResolvedValueOnce({
            ok: false,
            json: async () => ({}),
        });

        render(
            <EditSubmit
                selectedOptions={[{ column: "col1", selected_name: "Name 1" }]}
                displayName="Test Report"
                currentReportId={null}
                setCurrentReportId={setCurrentReportId}
                setReports={setReports}
                setIsEditMode={setIsEditMode}
            />,
        );
        fireEvent.click(screen.getByText("Save"));

        await waitFor(() => {
            expect(setReports).not.toHaveBeenCalled();
            expect(setCurrentReportId).not.toHaveBeenCalled();
            expect(setIsEditMode).not.toHaveBeenCalled();
        });
    });
});
