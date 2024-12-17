// @ts-check

import {
  getUserConfig,
  getAssetConfig,
  logo,
  downloadAssets,
  resolveDirectory,
} from "./lib/index.mjs";
import { log, time, timeEnd } from "./helpers/index.js";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { promises as fs } from "node:fs";
import path from "node:path";

/** @type {import('./types.d').Argv} */
const argv = yargs(hideBin(process.argv))
  .option("directory", {
    alias: "dir",
    type: "string",
    description: "Directory to save the assets",
  })
  .option("dryRun", {
    alias: "d",
    type: "boolean",
    default: false,
    description: "Run the script without downloading the assets",
  })
  .option("batchSize", {
    alias: "b",
    type: "number",
    default: 8,
  })
  .option("accessToken", {
    alias: "a",
    type: "string",
    description: "Figma access token",
  })
  .option("fileId", {
    alias: "f",
    type: "string",
    description: "Figma file ID",
  })
  .option("fileType", {
    alias: "e",
    type: "string",
    choices: ["svg", "png"],
    description: "File type for the assets",
    default: "svg",
  })
  .option("customLogo", {
    alias: "l",
    type: "string",
    description: "Custom logo to display",
  })
  .option("hideLogo", {
    alias: "hl",
    type: "boolean",
    default: false,
    description: "Hide the logo",
  })
  .option("pattern", {
    alias: "p",
    type: "string",
    description: "Pattern to filter components (optional, e.g., ^icon-)",
  })
  .alias("h", "help")
  .help()
  .parseSync();

/**
 * @param {import('./types.d').Argv} config
 * @returns {Promise<void>}
 */
const init = async (config = {}) => {
  const dryRun = config.dryRun ?? argv.dryRun;
  const customLogo = config.customLogo ?? argv.customLogo;
  const hideLogo = config.hideLogo ?? argv.hideLogo;

  if (!hideLogo) {
    log(customLogo ?? logo);
  }

  const userConfig = /** @type {import('./types.d').Config} */ (
    await getUserConfig({
      ...argv,
      ...config,
      ...process.env,
    })
  );

  if (!userConfig.accessToken || !userConfig.fileId) {
    log("Please provide an access token and file ID");
    return;
  }

  time("Figma Asset Download");

  const { directory, fileType } = userConfig;

  if (!directory) {
    throw new Error("Please provide a directory to save the assets");
  }

  const resolvedDirectory = resolveDirectory(directory);
  await fs.mkdir(resolvedDirectory, { recursive: true });

  const assetConfig = await getAssetConfig(userConfig);

  if (dryRun) {
    log("Dry run enabled, skipping download");

    await fs.writeFile(
      path.join(resolvedDirectory, "config.json"),
      JSON.stringify(assetConfig, null, 2),
      "utf-8"
    );

    return;
  }

  await downloadAssets(assetConfig, resolvedDirectory, fileType);

  timeEnd("Figma Asset Download");
};

export default init;
