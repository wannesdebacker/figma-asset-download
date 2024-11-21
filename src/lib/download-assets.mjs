// @ts-check

import ora from "ora";

import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * @param {(() => Promise<any>)[]} tasks
 * @param {number} [batchSize]
 * @returns {Promise<any[]>}
 */
async function batchPromiseAll(tasks, batchSize = 8) {
  const results = [];
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize).map((task) => task());
    results.push(...(await Promise.all(batch)));
  }
  return results;
}

/**
 * @typedef {import('../types').AssetConfig} AssetConfig
 * @param {AssetConfig[]} config
 * @param {string} directory
 * @param {string} extension
 * @returns {Promise<void>}
 * @throws {Error}
 */
export const downloadAssets = async (config, directory, extension) => {
  const spinner = ora("Downloading assets from Figma").start();

  try {
    const directoryPath = directory;

    await fs.mkdir(directoryPath, { recursive: true });

    const downloadTasks = config.map(({ name, downloadLink }) => async () => {
      if (!downloadLink) {
        throw new Error(`Download link is missing for ${name}`);
      }

      const response = await fetch(downloadLink);
      const buffer = Buffer.from(await response.arrayBuffer());

      const filePath = path.join(directoryPath, `${name}.${extension}`);

      await fs.writeFile(filePath, buffer);
    });

    await batchPromiseAll(downloadTasks);

    spinner.succeed(`Assets successfully downloaded to ${directory}`);
  } catch (err) {
    spinner.fail(
      `Something went wrong during asset download: ${
        err instanceof Error ? err.message : "Unknown error"
      }`
    );

    if (err instanceof Error) {
      throw new Error(
        `Something went wrong while downloading assets: ${err.message}`
      );
    } else {
      throw new Error("Something went wrong while downloading assets");
    }
  }
};
