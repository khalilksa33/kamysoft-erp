import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import globals from "globals";

export default [
    js.configs.recommended,
    {
        files: ["src/**/*.jsx", "src/**/*.js"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            parserOptions: {
                ecmaFeatures: { jsx: true }
            },
            globals: {
                ...globals.browser
            }
        },
        plugins: {
            react: reactPlugin
        },
        rules: {
            "no-undef": "error",
            "react/prop-types": "off"
        }
    }
];
