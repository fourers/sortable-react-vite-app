import js from "@eslint/js";
import stylisticJs from "@stylistic/eslint-plugin-js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";

export default [
    { ignores: ["dist"] },
    {
        files: ["**/*.{js,jsx}"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.browser,
                ...globals.vitest,
            },
            parserOptions: {
                ecmaVersion: "latest",
                ecmaFeatures: { jsx: true },
                sourceType: "module",
            },
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
            "@stylistic/js": stylisticJs,
            "simple-import-sort": simpleImportSort,
            "react": react,
        },
        rules: {
            ...js.configs.recommended.rules,
            "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true },
            ],
            "@stylistic/js/quotes": ["error", "double"],
            "@stylistic/js/semi": "error",
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
            "@stylistic/js/comma-dangle": ["error", "always-multiline"],
            "indent": ["error", 4],
            "react/jsx-uses-react": "error",
            "react/jsx-uses-vars": "error",
        },
    },
];
