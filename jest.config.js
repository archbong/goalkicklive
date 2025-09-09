/** @type {import('jest').Config} */
const config = {
  // The test environment that will be used for testing
  testEnvironment: "jsdom",

  // A list of paths to directories that Jest should use to search for files in
  roots: ["<rootDir>"],

  // The glob patterns Jest uses to detect test files
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "/out/", "/public/"],

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: [
    "/node_modules/",
    "^.+\\.module\\.(css|sass|scss)$",
  ],

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: {
    // Handle CSS imports (with CSS modules)
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",

    // Handle CSS imports (without CSS modules)
    "^.+\\.(css|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",

    // Handle image imports
    "^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$":
      "<rootDir>/__mocks__/fileMock.js",

    // Handle module aliases (if you're using them in your tsconfig.json)
    "^@/(.*)$": "<rootDir>/$1",
  },

  // An array of regexp pattern strings that are matched against all modules before the module loader will automatically return a mock for them
  // unmockedModulePathPatterns: undefined,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: false,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**",
    "!**/out/**",
    "!**/public/**",
    "!**/*.config.js",
    "!**/coverage/**",
    "!**/__tests__/**",
    "!**/types/**",
  ],

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/.next/",
    "/out/",
    "/public/",
  ],

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: ["json", "lcov", "text", "clover"],

  // Make calling deprecated APIs throw helpful error messages
  errorOnDeprecated: true,

  // The maximum amount of workers used to run your tests. Can be specified as % or a number. E.g. maxWorkers: 10% will use 10% of your CPU amount + 1 as the maximum number of workers. maxWorkers: 2 will use a maximum of 2 workers.
  maxWorkers: "50%",

  // Setup files to run before each test
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // Module file extensions for importing
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  // Transform files with ts-jest
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },

  // Global variables to be available in all test environments
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.jest.json",
    },
  },
};

module.exports = config;
