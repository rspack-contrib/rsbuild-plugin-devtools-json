# rsbuild-plugin-devtool-json

Rsbuild plugin for generating the Chrome DevTools project settings file on-the-fly in the dev server.

This enables seamless integration with the new Chrome DevTools features:

1. [DevTools Project Settings (devtools.json)](https://goo.gle/devtools-json-design)
2. [Automatic Workspace folders](http://goo.gle/devtools-automatic-workspace-folders)

## Installation

```bash
npm i -D rsbuild-plugin-devtool-json
```

## Usage

Add it to your Rsbuild config:

```js
import { defineConfig } from "@rsbuild/core";
import { pluginDevtoolsJson } from "rsbuild-plugin-devtool-json";

export default defineConfig({
  plugins: [
    pluginDevtoolsJson(),
    // ...
  ],
});
```

While the plugin can generate a UUID and save it in Rsbuild cache, you can also specify it in the options like in the following:

```js
pluginDevtoolsJson({ uuid: "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b" });
```

The `/.well-known/appspecific/com.chrome.devtools.json` endpoint will serve the project settings as JSON with the following structure:

```json
{
  "workspace": {
    "root": "/path/to/project/root",
    "uuid": "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b"
  }
}
```

Here `root` is the absolute path to your `{projectRoot}` folder, and `uuid` is a random v4 UUID, generated the first time that you start the Rsbuild dev server with the plugin installed (it is henceforth cached in the Rsbuild cache folder).

## Credits

This plugin is inspired by [vite-plugin-devtools-json](https://github.com/ChromeDevTools/vite-plugin-devtools-json). Both the implementation and documentation have been adapted and referenced from the original Vite plugin.

## License

The code is under [MIT License](LICENSE).
