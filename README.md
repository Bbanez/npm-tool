# Simple tool for NPM

I created this tool to bundle code that I need on almost every project that I'm working on. This includes bundling a TypeScrip project, packing it, linking, unlinking... There are also project that need additional configuration for bundling and some custom command that need to be executed in series.

This tool solves this problem by providing bundler, packer and linker and letting you define custom command which can be executed via CLI.

## Example configuration

```ts
// npm-tool.js - Create in the root of a project

import { createConfig } from '@banez/npm-tool';

/**
 * Intellisense is available so use CTRL+Space to
 * see options or inspect configuration interface.
 */
module.exports = createConfig({
  // Your options
});
```
