module.exports = {
  testEnvironment: "node",
  setupFiles: ["<rootDir>/src/jest.dotenvConfig.js"],
  setupFilesAfterEnv: ["<rootDir>/src/jest.setup.js"],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/"],
  moduleFileExtensions: ["js"],
};
