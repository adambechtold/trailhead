import js from "@eslint/js";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier";

export default [
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
    },
  },
  {
    // TypeScript already checks these; the core rules misfire on types.
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "no-undef": "off",
      "no-redeclare": "off",
    },
  },
];
