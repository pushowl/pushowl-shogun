const path = require("path");
const ROOT = path.resolve(__dirname);

module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  collectCoverage: false,
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  testPathIgnorePatterns: ["node_modules", "dist", "coverage", "docs"],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  setupFilesAfterEnv: [path.resolve(ROOT, "./scripts/jest-setup.ts")],
  collectCoverageFrom: [
    "./packages/*/src/**/*",
    "!./packages/*/src/**/*.stories.tsx",
    "!./packages/*/src/**/*.mock.ts",
    "!./packages/*/src/index.ts",
    "!./packages/frontend-customer/**/*.{ts,tsx}",
    "!./packages/frontend-checkout/**/*.{ts,tsx}",
  ],
  globals: {
    "ts-jest": {
      tsconfig: path.resolve(ROOT, "./tsconfig.node.json"),
    },
  },
  collectCoverageFrom: [
    "./src/**/*",
    "!./src/**/*.stories.tsx",
    "!./src/**/*.mock.ts",
    "!./src/index.ts",
  ],
};
