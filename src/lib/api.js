/**
 * @param {string} accessToken
 * @param {string} endpoint
 * @returns
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

    return res.json();
  } catch (err) {
    throw new Error(
      `Something went wrong while fetching data from Figma: ${err.message}`
    );
  }
};
