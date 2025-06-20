import fs from 'node:fs';
import path from 'node:path';
import { v4, validate } from 'uuid';
import type { RsbuildPlugin } from '@rsbuild/core';

interface DevToolsJSON {
  workspace?: {
    root: string;
    uuid: string;
  };
}

const ENDPOINT = '/.well-known/appspecific/com.chrome.devtools.json';

const plugin = (options?: { uuid: string }): RsbuildPlugin => ({
  name: 'rsbuild-plugin-devtools-json',
  setup(api) {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const getOrCreateUUID = () => {
      if (options?.uuid) {
        return options.uuid;
      }

      const cacheDir = api.context.cachePath;
      const uuidPath = path.resolve(cacheDir, 'uuid.json');

      if (fs.existsSync(uuidPath)) {
        const uuid = fs.readFileSync(uuidPath, { encoding: 'utf-8' });
        if (validate(uuid)) {
          return uuid;
        }
      }

      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const uuid = v4();
      fs.writeFileSync(uuidPath, uuid, { encoding: 'utf-8' });
      console.log(
        `[rsbuild-plugin-devtools-json] Generated UUID '${uuid}' for DevTools project settings.`,
      );
      return uuid;
    };

    api.modifyRsbuildConfig((userConfig, { mergeRsbuildConfig }) => {
      return mergeRsbuildConfig(userConfig, {
        dev: {
          setupMiddlewares: [
            (middlewares) => {
              middlewares.push((req, res, next) => {
                if (req.url !== ENDPOINT) {
                  return next();
                }

                let root = api.context.rootPath;

                // WSL case detection
                if (process.env.WSL_DISTRO_NAME) {
                  // Convert Linux path to Windows path format for WSL
                  root = path
                    .join(
                      '\\\\wsl.localhost',
                      process.env.WSL_DISTRO_NAME,
                      root,
                    )
                    .replace(/\//g, '\\');
                }

                const uuid = getOrCreateUUID();
                const devtoolsJson: DevToolsJSON = {
                  workspace: {
                    root,
                    uuid,
                  },
                };
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(devtoolsJson, null, 2));
              });
              return middlewares;
            },
          ],
        },
      });
    });
  },
});

export default plugin;