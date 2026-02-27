#!/usr/bin/env node
// @ts-check

import init from "./init.mjs";

// Execute init() only when run directly as a script
if (import.meta.url === `file://${process.argv[1]}`) {
  await init();
}

export default init;
export { init };
