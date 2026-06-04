import globals from "globals";
import eslintReact from "@eslint-react/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{js,jsx}"],
    extends: [eslintReact.configs.recommended],
    rules: {
      "no-unused-vars": "warn",
      "@eslint-react/dom-no-unknown-property": ["warn", { ignore: ["css"] }],
    },
    settings: { react: { version: "detect" } },
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
]);
