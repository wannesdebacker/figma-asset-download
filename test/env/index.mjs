import init from "../../src/init.mjs";

(async () => {
  try {
    await init({
      directory: "./dist",
      dryRun: false,
    });

    console.log("Programmatic test with .env completed successfully!");
  } catch (error) {
    console.error("Error during programmatic test:", error.message);
  }
})();
