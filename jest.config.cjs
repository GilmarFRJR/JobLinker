module.exports = {
  testEnvironment: "node",
  detectOpenHandles: true,
  setupFiles: ["<rootDir>/src/jest.setup.js"],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  moduleFileExtensions: ["js"],
};
