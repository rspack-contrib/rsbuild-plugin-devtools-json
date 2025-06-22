import { defineConfig } from '@rsbuild/core';
import { pluginDevtoolsJson } from '../src';

export default defineConfig({
  plugins: [pluginDevtoolsJson()],
});
