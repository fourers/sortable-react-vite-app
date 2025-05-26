import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, vi } from "vitest";
import "@testing-library/jest-dom";
import App from "./App";


describe("App", () => {
    // Mock child components to isolate App logic
    vi.mock("./components/Heading", () => ({
        Heading: () => <div data-testid="heading">Heading</div>,
    }));
    vi.mock("./pages/EditReport/EditModeWrapper", () => ({
        EditModeWrapper: (props) => <div data-testid="edit-mode-wrapper">{JSON.stringify(props)}</div>,
    }));
    vi.mock("./pages/ListReports/ReportMenu", () => ({
        ReportMenu: (props) => <><button data-testid="add-button" onClick={() => props.setIsEditMode(true)}></button><div data-testid="report-menu">{JSON.stringify(props)}</div></>,
    }));

    let fetchMock;

    beforeEach(() => {
        vi.resetAllMocks();
        fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            json: async () => [
                { id: 1, display_name: "Report 1" },
                { id: 2, display_name: "Report 2" },
            ],
        });
    });

    it("renders Heading and ReportMenu by default", async () => {
        render(<App />);
        expect(screen.getByTestId("heading")).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByTestId("report-menu")).toBeInTheDocument();
            expect(screen.getByTestId("add-button")).toBeInTheDocument();
        });
        expect(screen.queryByTestId("edit-mode-wrapper")).not.toBeInTheDocument();
    });

    it("shows EditModeWrapper when isEditMode is true", async () => {
        render(<App />);
        fireEvent.click(screen.getByTestId("add-button"));
        await waitFor(() => {
            expect(screen.getByTestId("edit-mode-wrapper")).toBeInTheDocument();
        });
        expect(screen.queryByTestId("report-menu")).not.toBeInTheDocument();
        expect(screen.queryByTestId("add-button")).not.toBeInTheDocument();
    });

    it("fetches reports on mount and passes them to ReportMenu", async () => {
        render(<App />);
        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledTimes(1);
            expect(fetchMock).toHaveBeenCalledWith("/api/reports");
        });
        const reportMenu = screen.getByTestId("report-menu");
        expect(reportMenu.textContent).toContain("Report 1");
        expect(reportMenu.textContent).toContain("Report 2");
    });

    it("handles error if fetch fails", async () => {
        fetchMock.mockResolvedValueOnce({
            ok: false,
            json: async () => [],
        });
        render(<App />);
        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledTimes(1);
            expect(fetchMock).toHaveBeenCalledWith("/api/reports");
        });
        expect(screen.getByTestId("report-menu").textContent).toBe("{\"reports\":[]}");
    });
});