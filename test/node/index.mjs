import init from "../../src/init.mjs";

(async () => {
  try {
    await init({
      accessToken: "add this for testing",
      fileId: "add this for testing",
      directory: "./dist",
      dryRun: false,
    });

    console.log("Programmatic test completed successfully!");
  } catch (error) {
    console.error("Error during programmatic test:", error.message);
  }
})();
