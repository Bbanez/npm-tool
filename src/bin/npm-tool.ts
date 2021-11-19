#!/usr/bin/env node

import { startNpmTool } from '../main';

startNpmTool().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
