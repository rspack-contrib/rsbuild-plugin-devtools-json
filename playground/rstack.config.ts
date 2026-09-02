// Configuration guide: https://rstack.rs/config
import { pluginDevtoolsJson } from '../src/index.ts';
import { define } from 'rstack';

define.app({
  plugins: [pluginDevtoolsJson()],
});
