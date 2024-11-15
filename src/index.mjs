#!/usr/bin/env node
// @ts-check

import {
  getUserConfig,
  getAssetConfig,
  logo,
  downloadAssets,
} from "./lib/index.mjs";
import { log, time, timeEnd } from "./helpers/index.js";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

import { promises as fs } from "node:fs";
import path from "node:path";

import "dotenv/config";

/** @type {import('./types.js').Argv} */
const argv = yargs(hideBin(process.argv))
  .option("directory", {
    alias: "dir",
    type: "string",
    description: "Directory to save the assets",
  })
  .option("dry-run", {
    alias: "d",
    type: "boolean",
    default: false,
    description: "Run the script without downloading the assets",
  })
  .option("batch-size", {
    alias: "b",
    type: "number",
    default: 8,
  })
  .option("accessToken", {
    alias: "a",
    type: "string",
    description: "Figma access token",
  })
  .option("frameId", {
    alias: "f",
    type: "string",
    description: "Figma file ID",
  })
  .alias("h", "help")
  .help()
  .parseSync();

const init = async () => {
  const { dryRun } = argv;

  log(logo);

  const userConfig = await getUserConfig(argv);

  if (!userConfig.accessToken || !userConfig.frameId) {
    log("Please provide an access token and frame ID");
    return;
  }

  time("Figma Asset Download");

  const { directory } = userConfig;

  if (!directory) {
    throw new Error("Please provide a directory to save the assets");
  }

  const config = await getAssetConfig(userConfig);

  if (dryRun) {
    log("Dry run enabled, skipping download");

    await fs.writeFile(
      path.join(directory, "config.json"),
      JSON.stringify(config, null, 2),
      "utf-8"
    );

    return;
  }

  await downloadAssets(config, directory);

  timeEnd("Figma Asset Download");
};

await init();

export default init;
