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

  it("should find components matching a pattern", () => {
    const mockNode = {
      type: "FRAME",
      children: [
        {
          type: "COMPONENT",
          name: "icon-button",
          id: "123",
        },
        {
          type: "COMPONENT",
          name: "icon-clock",
          id: "456",
        },
        {
          type: "COMPONENT",
          name: "button-primary",
          id: "789",
        },
      ],
    };

    const result = findComponents(mockNode, [], "^icon-");
    expect(result).toEqual([
      { name: "icon-button", id: "123" },
      { name: "icon-clock", id: "456" },
    ]);
  });

  it("should return an empty array if no components match the pattern", () => {
    const mockNode = {
      type: "FRAME",
      children: [
        {
          type: "COMPONENT",
          name: "button-primary",
          id: "123",
        },
        {
          type: "COMPONENT",
          name: "card-header",
          id: "456",
        },
      ],
    };

    const result = findComponents(mockNode, [], "^icon-");
    expect(result).toEqual([]);
  });

  it("should find components with a case-insensitive pattern", () => {
    const mockNode = {
      type: "FRAME",
      children: [
        {
          type: "COMPONENT",
          name: "Icon-Button",
          id: "123",
        },
        {
          type: "COMPONENT",
          name: "ICON-Clock",
          id: "456",
        },
        {
          type: "COMPONENT",
          name: "button-primary",
          id: "789",
        },
      ],
    };

    const result = findComponents(mockNode, [], "^icon-", "i"); // Case-insensitive
    expect(result).toEqual([
      { name: "Icon-Button", id: "123" },
      { name: "ICON-Clock", id: "456" },
    ]);
  });

  it("should include all components if pattern is null", () => {
    const mockNode = {
      type: "FRAME",
      children: [
        {
          type: "COMPONENT",
          name: "icon-button",
          id: "123",
        },
        {
          type: "COMPONENT",
          name: "button-primary",
          id: "456",
        },
      ],
    };

    const result = findComponents(mockNode, [], null);
    expect(result).toEqual([
      { name: "icon-button", id: "123" },
      { name: "button-primary", id: "456" },
    ]);
  });

  it("should handle a pattern that matches no components gracefully", () => {
    const mockNode = {
      type: "FRAME",
      children: [
        {
          type: "COMPONENT",
          name: "card-header",
          id: "123",
        },
        {
          type: "COMPONENT",
          name: "footer-link",
          id: "456",
        },
      ],
    };

    const result = findComponents(mockNode, [], "nonexistent-pattern");
    expect(result).toEqual([]);
  });

  it("should handle special characters in regex patterns", () => {
    const mockNode = {
      type: "FRAME",
      children: [
        { type: "COMPONENT", name: "my.component", id: "123" },
        { type: "COMPONENT", name: "my-component", id: "456" },
        { type: "COMPONENT", name: "my_component", id: "789" },
      ],
    };

    const result = findComponents(mockNode, [], "my\\.component");
    expect(result).toEqual([{ name: "my.component", id: "123" }]);
  });

  it("should match components with digits in their names", () => {
    const mockNode = {
      type: "FRAME",
      children: [
        { type: "COMPONENT", name: "icon-123", id: "123" },
        { type: "COMPONENT", name: "icon-456", id: "456" },
        { type: "COMPONENT", name: "button-789", id: "789" },
      ],
    };

    const result = findComponents(mockNode, [], "icon-\\d+");
    expect(result).toEqual([
      { name: "icon-123", id: "123" },
      { name: "icon-456", id: "456" },
    ]);
  });

  it("should handle deeply nested components with patterns", () => {
    const mockNode = {
      type: "FRAME",
      children: [
        {
          type: "FRAME",
          children: [
            { type: "COMPONENT", name: "icon-clock", id: "123" },
            {
              type: "FRAME",
              children: [
                { type: "COMPONENT", name: "icon-settings", id: "456" },
                { type: "COMPONENT", name: "button-save", id: "789" },
              ],
            },
          ],
        },
      ],
    };

    const result = findComponents(mockNode, [], "^icon-");
    expect(result).toEqual([
      { name: "icon-clock", id: "123" },
      { name: "icon-settings", id: "456" },
    ]);
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
