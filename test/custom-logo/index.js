import init from "../../src/init.mjs";

import customLogo from "./custom-logo.mjs";

(async () => {
  try {
    await init({
      directory: "./dist",
      dryRun: false,
      customLogo: customLogo,
    });

    console.log("Programmatic test completed successfully!");
  } catch (error) {
    console.error("Error during programmatic test:", error.message);
  }
})();
