import path from "node:path";
import os from "node:os";

/**
 * @param {string | undefined} inputPath
 * @returns {string}
 * @throws {Error}
 */

export const resolveDirectory = (inputPath) => {
  if (!inputPath) {
    throw new Error("Path is required but was not provided.");
  }

  if (inputPath.startsWith("~")) {
    inputPath = path.join(os.homedir(), inputPath.slice(1));
  }

  return path.resolve(inputPath);
};
