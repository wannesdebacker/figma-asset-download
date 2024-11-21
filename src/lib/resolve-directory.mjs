import path from "node:path";

export const resolveDirectory = (directory) => {
  return path.isAbsolute(directory)
    ? directory
    : path.resolve(process.cwd(), directory);
};
