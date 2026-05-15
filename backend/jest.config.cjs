/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  roots: ["<rootDir>/src"],
  modulePaths: ["<rootDir>/src"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {
      tsconfig: "tsconfig.test.json",
      useESM: false,
    }],
  },
  moduleNameMapper: {
  "^(\\.{1,2}/.*)\\.js$": "$1",
  "^@app$": "<rootDir>/src/app.ts",
  "^@lib/prisma$": "<rootDir>/src/lib/prisma/prisma.ts",
},
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  clearMocks: true,
  restoreMocks: true,
  testTimeout: 15000,
  verbose: true,
  globalSetup: "<rootDir>/src/__tests__/setup/globalSetup.ts",
  globalTeardown: "<rootDir>/src/__tests__/setup/globalTeardown.ts",
  coverageThreshold: {
    global: { branches: 70, functions: 75, lines: 75, statements: 75 },
  },
};

module.exports = config;