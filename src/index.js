import {
  getUserConfig,
  getAssetConfig,
  logo,
  downloadAssets,
} from "./lib/index.js";
import { log, time, timeEnd } from "./helpers/index.js";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

import fs from "node:fs/promises";
import path from "node:path";

import "dotenv/config";

const argv = yargs(hideBin(process.argv))
  .option("directory", {
    alias: "dir",
    type: "string",
    default: "./dist",
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
  .parse();

const init = async () => {
  const { dryRun, directory } = argv;

  log(logo);

  const userConfig = await getUserConfig(argv);
  time("Figma Asset Download");

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
