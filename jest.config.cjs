module.exports = {
  testEnvironment: "node",
  setupFiles: ["<rootDir>/src/jest.setup.js"],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/"],
  moduleFileExtensions: ["js"],
};
