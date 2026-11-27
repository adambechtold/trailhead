import js from "@eslint/js";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier";

const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "public/**",
      "save/**",
      "next-env.d.ts",
    ],
  },
  ...nextCoreWebVitals,
  js.configs.recommended,
  prettier,
  {
    rules: {
      "sort-imports": [
        "error",
        {
          ignoreCase: false,
          ignoreDeclarationSort: false,
          memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
          allowSeparatedGroups: true,
        },
      ],
      quotes: ["error", "double"],
      // Map images are user photos (data/blob URLs) shown inside a pan/zoom
      // canvas, which next/image doesn't support; the icons are small SVGs.
      "@next/next/no-img-element": "off",
    },
  },
  {
    // TypeScript already checks these; the core rules misfire on types.
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "no-undef": "off",
      "no-redeclare": "off",
      // The core rule flags parameter names in type signatures.
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrors: "none" },
      ],
    },
  },
];

export default config;
