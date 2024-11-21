// @ts-check

import { figmaApi } from "./api.mjs";

/**
 * @typedef {import('../types.d').AssetConfig} AssetConfig
 * @typedef {import('../types.d').FigmaNode} FigmaNode
 * @typedef {import('../types.d').Config} UserConfig
 */

/**
 * @param {FigmaNode} node
 * @param {string} type
 * @param {AssetConfig[]} components
 * @returns {AssetConfig[]}
 */
const findComponents = (node, type, components = []) => {
  if (node.type === type && node.name && node.id) {
    components.push({ name: node.name, id: node.id });
  }

  if (node.children) {
    node.children.forEach((child) => findComponents(child, type, components));
  }

  return components;
};

/**
 * @param {{ children: FigmaNode[] }} document
 * @param {string} type
 * @returns {AssetConfig[]}
 * @throws {Error}
 */
const getPageObject = (document, type) => {
  try {
    return document.children.reduce(
      /**
       * @param {AssetConfig[]} allComponents
       * @param {FigmaNode} frame
       * @returns {AssetConfig[]}
       */
      (allComponents, frame) => {
        return allComponents.concat(findComponents(frame, type, []));
      },
      []
    );
  } catch (err) {
    throw new Error(
      `Something went wrong while creating asset config: ${
        err instanceof Error ? err.message : "Unknown error"
      }`
    );
  }
};

/**
 * @param {UserConfig} userConfig
 * @returns {Promise<AssetConfig[]>}
 * @throws {Error}
 */
export const getAssetConfig = async (userConfig) => {
  const { accessToken, frameId, type, extension } = userConfig;

  if (!accessToken || !frameId) {
    throw new Error("Please provide an access token and frame ID");
  }

  const rawData = await figmaApi(accessToken, `files/${frameId}`);

  if (!rawData.document) {
    throw new Error("Document not found");
  }

  const data = getPageObject(rawData.document, type);
  return await enrichData(data, accessToken, frameId, extension);
};

/**
 * @param {AssetConfig[]} data
 * @param {string} accessToken
 * @param {string} frameId
 * @param {string} extension
 * @returns {Promise<AssetConfig[]>}
 * @throws {Error}
 */
export const enrichData = async (data, accessToken, frameId, extension) => {
  try {
    const ids = data.map((item) => item.id).join(",");
    const response = await figmaApi(
      accessToken,
      `images/${frameId}?ids=${ids}&format=${extension}`
    );

    return data.map((item) => ({
      ...item,
      downloadLink: response.images[item.id],
    }));
  } catch (err) {
    throw new Error(
      `Something went wrong while enriching data: ${
        err instanceof Error ? err.message : "Unknown error"
      }`
    );
  }
};
