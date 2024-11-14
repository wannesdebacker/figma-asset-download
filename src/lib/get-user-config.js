import Enquirer from "enquirer";

const { prompt } = Enquirer;

/**
 * @returns {Promise<{accessToken: string, fileId: string}>}
 */
export const getUserConfig = async (args) => {
  try {
    const { accessToken, frameId } = args;

    const questions = [];

    if (!accessToken) {
      questions.push({
        type: "input",
        name: "access-token",
        message: "What's your Figma access token?",
      });
    }

    if (!frameId) {
      questions.push({
        type: "input",
        name: "frame-id",
        message: "What's the ID of the Figma file?",
      });
    }

    let answers = {};

    if (questions.length > 0) {
      answers = await prompt(questions);
    }

    return {
      accessToken: accessToken || answers["access-token"],
      fileId: frameId || answers["frame-id"],
    };
  } catch (err) {
    throw new Error(
      `Something went wrong while creating user config: ${err.message}`
    );
  }
};
