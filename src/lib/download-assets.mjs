// @ts-check

import ora from "ora";

import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * @param {string} name
 * @returns {string}
 */
const sanitizeFileName = (name) => {
  return name
    .trim()
    .replace(/[#,=]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_.-]/g, "")
    .replace(/_{2,}/g, "_");
};

/**
 * @typedef {import('../types').AssetConfig} AssetConfig
 * @param {AssetConfig[]} config
 * @param {string} directory
 * @param {string} fileType
 * @returns {Promise<void>}
 * @throws {Error}
 */
export const downloadAssets = async (config, directory, fileType) => {
  const spinner = ora("Downloading assets from Figma").start();

  try {
    const directoryPath = directory;

    await fs.mkdir(directoryPath, { recursive: true });

    // Process downloads serially to respect rate limits
    for (let i = 0; i < config.length; i++) {
      const { name, downloadLink } = config[i];

      if (!downloadLink) {
        throw new Error(`Download link is missing for ${name}`);
      }

      const sanitizedFileName = sanitizeFileName(name);

      spinner.text = `Downloading assets from Figma (${i + 1}/${config.length}): ${name}`;

      const response = await fetch(downloadLink);
      const buffer = Buffer.from(await response.arrayBuffer());

      const filePath = path.join(
        directoryPath,
        `${sanitizedFileName}.${fileType}`
      );

      await fs.writeFile(filePath, buffer);
    }

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
