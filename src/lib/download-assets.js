import fs from "node:fs/promises";
import path from "node:path";

async function batchPromiseAll(tasks, batchSize = 8) {
  const results = [];
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize).map((task) => task());
    results.push(...(await Promise.all(batch)));
  }
  return results;
}

export const downloadAssets = async (config, directory) => {
  try {
    await fs.mkdir(directory, { recursive: true });

    const downloadTasks = config.map(({ name, downloadLink }) => async () => {
      const response = await fetch(downloadLink);
      const buffer = Buffer.from(await response.arrayBuffer());

      const filePath = path.join(directory, `${name}.svg`);

      await fs.writeFile(filePath, buffer);
    });

    await batchPromiseAll(downloadTasks);
  } catch (err) {
    throw new Error(
      `Something went wrong while downloading assets: ${err.message}`
    );
  }
};
