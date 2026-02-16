import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";

const shallowClean = (obj) => {
    if (typeof obj !== "object" || obj === null) return obj;
    const { __esModule, ...rest } = obj;
    return rest;
};

export default tseslint.config(
    {
        ignores: ["**/dist/**", "**/.yarn/**", "**/.pnp.*", "eslint.config.js"],
    },
    { ...js.configs.recommended },
    ...tseslint.configs.recommended.map((config) => ({ ...config })),
    {
        files: ["**/*.{ts,tsx}"],
        plugins: {
            "react-hooks": shallowClean(reactHooks),
            "react-refresh": shallowClean(reactRefresh),
            import: shallowClean(importPlugin),
        },
        languageOptions: {
            parser: tseslint.parser,
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true },
            ],
            "import/order": [
                "error",
                {
                    groups: [
                        "builtin",
                        "external",
                        "internal",
                        "parent",
                        "sibling",
                    ],
                    "newlines-between": "always",
                    alphabetize: { order: "asc", caseInsensitive: true },
                },
            ],
        },
        settings: {
            "import/resolver": {
                typescript: {
                    alwaysTryTypes: true,
                    project: "./tsconfig.json",
                },
            },
        },
    },
);
