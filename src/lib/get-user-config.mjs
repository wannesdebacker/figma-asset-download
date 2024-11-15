// @ts-check

import Enquirer from "enquirer";

const { prompt } = Enquirer;

/** @typedef {import('../types').Argv} Argv */
/** @typedef {import('../types').UserConfigArgs} UserConfigArgs */

/**
 * @param {Argv} args
 * @returns {Promise<UserConfigArgs>}
 */
export const getUserConfig = async (args) => {
  try {
    const { accessToken, frameId, directory } = args;

    const questions = [];

    if (!accessToken) {
      questions.push({
        type: "input",
        name: "accessToken",
        message: "What's your Figma access token?",
      });
    }

    if (!frameId) {
      questions.push({
        type: "input",
        name: "frameId",
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
      accessToken: accessToken || answers.accessToken,
      frameId: frameId || answers.frameId,
      directory: directory || answers.directory,
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
