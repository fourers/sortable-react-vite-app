import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        globals: true,
        coverage: {
            exclude: [
                "src/tests/setup.js",
                "**/*.config.js",
                "src/main.jsx",
            ],
        },
        silent: "passed-only",
    },
});
