// @ts-check

/**
 * @typedef {import('../types').FigmaApiResponse} FigmaApiResponse
 * @typedef {import('../types').FigmaApi} FigmaApi
 */

/**
 * Sleep helper function for retrying requests
 * @param {number} ms - milliseconds to sleep
 * @returns {Promise<void>}
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * @param {string} accessToken
 * @param {string} endpoint
 * @param {number} [maxRetries=10] - Maximum number of retry attempts for 429 errors
 * @returns {Promise<FigmaApiResponse>}
 * @throws {Error}
 */
export const figmaApi = async (accessToken, endpoint, maxRetries = 10) => {
  let attempts = 0;

  while (true) {
    try {
      const res = await fetch(
        `${
          process.env.FIGMA_API_BASE_URL || "https://api.figma.com/v1/"
        }${endpoint}`,
        {
          method: "GET",
          headers: {
            "X-Figma-Token": accessToken,
          },
        }
      );

      // Handle rate limiting with retry logic
      if (res.status === 429) {
        if (attempts >= maxRetries) {
          const upgradeLink = res.headers.get("x-figma-upgrade-link") || "";
          const rateLimitType =
            res.headers.get("x-figma-rate-limit-type") || "unknown";
          const planTier = res.headers.get("x-figma-plan-tier") || "unknown";

          throw new Error(
            `Rate limit exceeded after ${attempts} attempts. ` +
              `Plan: ${planTier}, Rate limit type: ${rateLimitType}. ` +
              (upgradeLink
                ? `Consider upgrading: ${upgradeLink}`
                : "Consider upgrading your Figma plan or using a different access token.")
          );
        }

        const retryAfterSec = Number(res.headers.get("retry-after")) || 1;
        console.log(
          `Rate limited. Retrying after ${retryAfterSec} seconds (attempt ${attempts + 1}/${maxRetries})...`
        );

        await sleep(retryAfterSec * 1000);
        attempts++;
        continue;
      }

      if (!res.ok) {
        throw new Error(
          `Something went wrong while fetching data from Figma: ${res.status} ${res.statusText}`
        );
      }

      return /** @type {FigmaApiResponse} */ (await res.json());
    } catch (err) {
      // Re-throw rate limit errors as-is
      if (err instanceof Error && err.message.includes("Rate limit exceeded")) {
        throw err;
      }

      if (err instanceof Error) {
        throw new Error(
          `Something went wrong while fetching data from Figma: ${err.message}`
        );
      }

      throw new Error("Something went wrong while fetching data from Figma");
    }
  }
};
