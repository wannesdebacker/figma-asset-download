import fiado from "../../src/init.mjs";

(async () => {
  try {
    await fiado({
      directory: "./dist",
      dryRun: false,
      pattern: "^logo-",
    });

    console.log("Programmatic test with .env completed successfully!");
  } catch (error) {
    console.error("Error during programmatic test:", error.message);
  }
})();
