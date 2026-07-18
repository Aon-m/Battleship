import js from "@eslint/js";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        describe: "readonly",
        test: "readonly",
        jest: "readonly",
        expect: "readonly",
        console: "readonly",
        clearTimeout: "readonly",
        setTimeout: "readonly",
        crypto: "readonly",
        document: "readonly",
        requestAnimationFrame: "readonly",
        ResizeObserver: "readonly",
        getComputedStyle: "readonly",
        FormData: "readonly",
        URL: "readonly",
        require: "readonly",
        alert: "readonly",
        Audio: "readonly",
        window: "readonly",
      },
    },
  },
]);
