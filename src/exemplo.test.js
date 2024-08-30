// example.test.js
import { describe, test, expect } from "@jest/globals";

describe("Babel integration with Jest", () => {
  test("should transpile ES6 code", () => {
    const arrowFunction = () => "ES6 is working!";
    expect(arrowFunction()).toBe("ES6 is working!");
  });
});
