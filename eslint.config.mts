import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  js.configs.recommended,

  ...tseslint.configs.recommended,

  prettier, // вимикає ESLint-правила, що конфліктують з Prettier

  {
    files: ["**/*.{ts,js}"],
    languageOptions: {
      globals: globals.node,
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]);
