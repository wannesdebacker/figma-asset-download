import { figmaApi } from "./api.js";

/**
 * @typedef {Object} ComponentData
 * @property {string} name
 * @property {string} id
 */

/**
 * @typedef {Object} FigmaNode
 * @property {string} type
 * @property {string} [name]
 * @property {string} [id]
 * @property {FigmaNode[]} [children]
 */

/**
 * @param {FigmaNode} node
 * @param {ComponentData[]} components
 * @returns {ComponentData[]}
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
 * @returns {ComponentData[]}
 */
const getPageObject = (document) => {
  try {
    return document.children.reduce((allComponents, frame) => {
      const frameComponents = findComponents(frame);
      return allComponents.concat(frameComponents);
    }, []);
  } catch (err) {
    throw new Error(
      `Something went wrong while creating asset config: ${err.message}`
    );
  }
};

/**
 * @typedef {Object} UserConfig
 * @property {string} accessToken
 * @property {string} fileId
 */

/**
 * @param {UserConfig} userConfig
 * @returns {Promise<ComponentData[]>}
 */
export const getAssetConfig = async (userConfig) => {
  try {
    const { accessToken, fileId } = userConfig;
    const rawData = await figmaApi(accessToken, `files/${fileId}`);
    const data = getPageObject(rawData.document);
    const enrichedData = await enrichData(data);

    return enrichedData;
  } catch (err) {
    throw new Error(
      `Something went wrong while creating asset config: ${err.message}`
    );
  }
};

export const enrichData = async (data) => {
  try {
    const assetsIdsCommaSeperated = data.map((item) => item.id).join(",");

    const assetsDownloadUrl = await figmaApi(
      process.env.FIGMA_ACCESS_TOKEN,
      `images/${process.env.FIGMA_FRAME_ID}?ids=${assetsIdsCommaSeperated}&format=svg`
    );

    return data.map((item) => ({
      ...item,
      downloadLink: assetsDownloadUrl.images[item.id],
    }));
  } catch (err) {
    throw new Error(
      `Something went wrong while enriching data: ${err.message}`
    );
  }
};
