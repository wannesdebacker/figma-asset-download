// @ts-check

/**
 * @typedef {import('../types').FigmaApiResponse} FigmaApiResponse
 * @typedef {import('../types').FigmaApi} FigmaApi
 */

/**
 * @param {string} accessToken
 * @param {string} endpoint
 * @returns {Promise<FigmaApiResponse>}
 * @throws {Error}
 */
export const figmaApi = async (accessToken, endpoint) => {
  try {
    const res = await fetch(`${process.env.FIGMA_API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "X-Figma-Token": accessToken,
      },
    });

    if (!res.ok) {
      throw new Error(
        `Something went wrong while fetching data from Figma: ${res.statusText}`
      );
    }

    return /** @type {FigmaApiResponse} */ (await res.json());
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(
        `Something went wrong while fetching data from Figma: ${err.message}`
      );
    }

    throw new Error("Something went wrong while fetching data from Figma");
  }
};
