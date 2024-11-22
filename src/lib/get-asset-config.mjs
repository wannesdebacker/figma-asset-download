// @ts-check

import { figmaApi } from "./api.mjs";

import ora from "ora";

/**
 * @typedef {import('../types.d').AssetConfig} AssetConfig
 * @typedef {import('../types.d').FigmaNode} FigmaNode
 * @typedef {import('../types.d').Config} UserConfig
 */

/**
 * @param {FigmaNode} node
 * @param {AssetConfig[]} components
 * @returns {AssetConfig[]}
 */
const findComponents = (node, components = []) => {
  if (node.type === "COMPONENT" && node.name && node.id) {
    components.push({ name: node.name, id: node.id });
  }

  if (node.children) {
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
       * @param {AssetConfig[]} allComponents
       * @param {FigmaNode} file
       * @returns {AssetConfig[]}
       */
      (allComponents, file) => {
        return allComponents.concat(findComponents(file, []));
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
  const spinner = ora("Getting asset configuration").start();

  try {
    const { accessToken, fileId, fileType } = userConfig;

    if (!accessToken || !fileId) {
      throw new Error("Please provide an access token and file ID");
    }

    const rawData = await figmaApi(accessToken, `files/${fileId}`);

    if (!rawData.document) {
      throw new Error("Document not found");
    }

    const data = getPageObject(rawData.document);

    spinner.succeed("Successfully fetched asset configuration");

    return await enrichData(data, accessToken, fileId, fileType);
  } catch (err) {
    spinner.fail("Something went wrong during getting asset configuration");

    throw new Error(
      `Something went wrong while fetching asset config: ${
        err instanceof Error ? err.message : "Unknown error"
      }`
    );
  }
};

/**
 * @param {AssetConfig[]} data
 * @param {string} accessToken
 * @param {string} fileId
 * @param {string} fileType
 * @returns {Promise<AssetConfig[]>}
 * @throws {Error}
 */
export const enrichData = async (data, accessToken, fileId, fileType) => {
  try {
    const ids = data.map((item) => item.id).join(",");
    const response = await figmaApi(
      accessToken,
      `images/${fileId}?ids=${ids}&format=${fileType}`
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
