import { describe, it, expect, vi } from "vitest";
import path from "node:path";
import os from "node:os";

import {
  findComponents,
  getPageObject,
  resolveDirectory,
} from "../src/lib/index.mjs";

describe("findComponents", () => {
  it("should find components in a nested structure", () => {
    const mockNode = {
      type: "FRAME",
      children: [
        {
          type: "COMPONENT",
          name: "icon-button",
          id: "123",
        },
        {
          type: "FRAME",
          children: [
            {
              type: "COMPONENT",
              name: "icon-clock",
              id: "456",
            },
            {
              type: "FRAME",
              name: "not-an-icon",
              id: "789",
            },
          ],
        },
      ],
    };

    const result = findComponents(mockNode);
    expect(result).toEqual([
      { name: "icon-button", id: "123" },
      { name: "icon-clock", id: "456" },
    ]);
  });

  it("should return an empty array if no components are found", () => {
    const mockNode = {
      type: "FRAME",
      children: [
        {
          type: "FRAME",
          children: [
            {
              type: "FRAME",
              name: "not-an-icon",
              id: "789",
            },
          ],
        },
      ],
    };

    const result = findComponents(mockNode);
    expect(result).toEqual([]);
  });
});

describe("getPageObject", () => {
  it("should aggreggate all components from a document", () => {
    const mockDocument = {
      children: [
        {
          type: "FRAME",
          children: [
            {
              type: "COMPONENT",
              name: "icon-1",
              id: "1",
            },
          ],
        },
      ],
    };

    const result = getPageObject(mockDocument);
    expect(result).toEqual([{ name: "icon-1", id: "1" }]);
  });

  it("should throw error if the document is malformed", () => {
    expect(() => getPageObject(null)).toThrowError();
  });
});

describe("resolveDirectory", () => {
  it("should resolve a relative path", () => {
    const result = resolveDirectory("./test-path");
    const expected = path.resolve("./test-path");
    expect(result).toBe(expected);
  });

  it("should resolve an absolute path", () => {
    const absolutePath = path.resolve("/absolute/test-path");
    const result = resolveDirectory(absolutePath);
    expect(result).toBe(absolutePath);
  });

  it("should resolve a home directory path", () => {
    const mockedHomeDir = "/mocked/home";
    vi.spyOn(os, "homedir").mockReturnValue(mockedHomeDir);

    const result = resolveDirectory("~/test-path");
    expect(result).toBe(path.resolve(mockedHomeDir, "test-path"));

    vi.restoreAllMocks();
  });

  it("should resolve paths with redundant slashes", () => {
    const result = resolveDirectory("./test-path///sub-path");
    const expected = path.resolve("./test-path/sub-path");
    expect(result).toBe(expected);
  });

  it("should resolve paths with `..` segments", () => {
    const result = resolveDirectory("./test-path/sub-path/../final-path");
    const expected = path.resolve("./test-path/final-path");
    expect(result).toBe(expected);
  });

  it("should throw an error if the path is null or undefined", () => {
    expect(() => resolveDirectory(null)).toThrow(
      "Path is required but was not provided."
    );
    expect(() => resolveDirectory(undefined)).toThrow(
      "Path is required but was not provided."
    );
  });

  it("should handle empty strings as paths", () => {
    expect(() => resolveDirectory("")).toThrow(
      "Path is required but was not provided."
    );
  });
});
