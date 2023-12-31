/* eslint-env node */
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:unicorn/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:@eslint-react/all-legacy",
    "plugin:react-hooks/recommended",
    "plugin:@next/next/recommended",
    "plugin:tailwindcss/recommended",
    "prettier",
  ],
  plugins: ["@typescript-eslint", "validate-jsx-nesting"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  root: true,
  ignorePatterns: ["**/*.js", "**/*.cjs", "**/*.mjs"],
  rules: {
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-import-type-side-effects": "error",
    "unicorn/prevent-abbreviations": "off",
    // https://github.com/sindresorhus/meta/discussions/7
    "unicorn/no-null": "off",
    // https://github.com/orgs/web-infra-dev/discussions/10
    "unicorn/prefer-top-level-await": "off",

    "no-console": ["warn", { allow: ["warn", "error"] }],

    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: {
          arguments: false,
          attributes: false,
        },
      },
    ],
    "@eslint-react/naming-convention/filename": [
      "error",
      {
        rule: "kebab-case",
      },
    ],

    "validate-jsx-nesting/no-invalid-jsx-nesting": "error",

    "tailwindcss/classnames-order": "off",
  },

  settings: {
    tailwindcss: {
      callees: ["classnames", "clsx", "ctl", "cn"],
    },
  },

  overrides: [
    {
      files: ["*.tsx", "*.ts"],
      excludedFiles: [
        "src/app/**/{layout,page,loding,not-found,error,global-error,route,template,default}.tsx",
        "*.config.ts",
      ],
      rules: {
        // disable export * and enum
        "no-restricted-syntax": [
          "error",
          {
            selector: ":matches(ExportAllDeclaration)",
            message: "Export only modules you need.",
          },
          {
            selector: "TSEnumDeclaration",
            message: "We should not use Enum",
          },
        ],
        "no-restricted-exports": [
          "error",
          {
            restrictDefaultExports: { direct: true },
          },
        ],
      },
    },
  ],
}
