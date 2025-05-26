import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Heading } from "./Heading";

describe("Heading", () => {
    it("renders the app heading", () => {
        render(<Heading />);
        expect(screen.getByRole("heading", { name: "Sortable App" })).toBeInTheDocument();
    });
});
