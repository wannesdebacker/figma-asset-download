// @ts-check

import Enquirer from "enquirer";
import { config as loadEnv } from "dotenv";
import path from "node:path";

const { prompt } = Enquirer;

loadEnv({ path: path.resolve(process.cwd(), ".env") });

/** @typedef {import('../types').Argv} Argv */
/** @typedef {import('../types').Argv} UserConfigArgs */

/**
 * @param {Argv} args
 * @returns {Promise<UserConfigArgs>}
 */
export const getUserConfig = async (args) => {
  try {
    const {
      accessToken: argAccessToken,
      fileId: argFileId,
      directory,
      fileType,
    } = args;

    const envAccessToken = process.env.FIGMA_ASSET_TOKEN || null;
    const envFileId = process.env.FIGMA_FILE_ID || null;

    const questions = [];

    if (!argAccessToken && !envAccessToken) {
      questions.push({
        type: "input",
        name: "accessToken",
        message: "What's your Figma access token?",
      });
    }

    if (!argFileId && !envFileId) {
      questions.push({
        type: "input",
        name: "fileId",
        message: "What's the ID of the Figma file?",
      });
    }

    if (!directory) {
      questions.push({
        type: "input",
        name: "directory",
        message: "What's the directory to save the assets?",
        default: "./dist",
      });
    }

    /** @type {UserConfigArgs} */
    let answers = {};

    if (questions.length > 0) {
      answers = await prompt(questions);
    }

    return {
      accessToken: argAccessToken || envAccessToken || answers.accessToken,
      fileId: argFileId || envFileId || answers.fileId,
      directory: directory || answers.directory,
      fileType,
    };
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(
        `Something went wrong while creating user config: ${err.message}`
      );
    } else {
      throw new Error("Something went wrong while creating user config");
    }
  }
};
