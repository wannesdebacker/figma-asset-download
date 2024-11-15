// @ts-check

import { figmaApi } from "./api.mjs";

/**
 * @typedef {import('../types.js').AssetConfig} AssetConfig
 * @typedef {import('../types.js').UserConfigArgs} UserConfigArgs
 * @typedef {import('../types.js').FigmaNode} FigmaNode
 */

/**
 * @param {FigmaNode} node
 * @param {AssetConfig[]} components
 * @returns {AssetConfig[]}
 */

const findComponents = (node, components = []) => {
  if (node.type === process.env.FIGMA_TYPE_TO_EXTRACT && node.name && node.id) {
    components.push({ name: node.name, id: node.id });
  }

  if (node.children && node.children.length > 0) {
    node.children.forEach((child) => findComponents(child, components));
  }

  return components;
};

/**
 * @param {{ children: FigmaNode[] }} document
 * @returns {AssetConfig[]}
 * @throws {Error}
 */
const getPageObject = (document) => {
  try {
    return document.children.reduce(
      /**
       * @param {AssetConfig[]} allComponents - Accumulated components.
       * @param {FigmaNode} frame - The current node being processed.
       * @returns {AssetConfig[]} Updated array of components.
       */
      (allComponents, frame) => {
        const frameComponents = findComponents(frame);

        return allComponents.concat(frameComponents);
      },
      []
    );
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(
        `Something went wrong while creating asset config: ${err.message}`
      );
    } else {
      throw new Error("Something went wrong while creating asset config");
    }
  }
};

/**
 * @typedef {Object} UserConfig
 * @property {string} accessToken
 * @property {string} frameId
 */

/**
 * @param {UserConfigArgs} userConfig
 * @returns {Promise<AssetConfig[]>}
 * @throws {Error}
 */
export const getAssetConfig = async (userConfig) => {
  try {
    const { accessToken, frameId } = userConfig;

    if (!accessToken || !frameId) {
      throw new Error("Please provide an access token and frame ID");
    }

    const rawData = await figmaApi(accessToken, `files/${frameId}`);

    if (!rawData.document) {
      throw new Error("Document not found");
    }

    const data = getPageObject(rawData.document);
    const enrichedData = await enrichData(data);

    return enrichedData;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(
        `Something went wrong while creating asset config: ${err.message}`
      );
    } else {
      throw new Error("Something went wrong while creating asset config");
    }
  }
};

/**
 * @param {AssetConfig[]} data - An array of component data.
 * @returns {Promise<AssetConfig[]>} A promise resolving to enriched components.
 */
export const enrichData = async (data) => {
  try {
    const assetsIdsCommaSeperated = data.map((item) => item.id).join(",");

    if (!process.env.FIGMA_ACCESS_TOKEN) {
      throw new Error("Please provide a Figma access token");
    }

    const assetsDownloadUrl = await figmaApi(
      process.env.FIGMA_ACCESS_TOKEN,
      `images/${process.env.FIGMA_FRAME_ID}?ids=${assetsIdsCommaSeperated}&format=svg`
    );

    return data.map((item) => ({
      ...item,
      downloadLink: assetsDownloadUrl.images[item.id],
    }));
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(
        `Something went wrong while enriching data: ${err.message}`
      );
    } else {
      throw new Error("Something went wrong while enriching data");
    }
  }
};
