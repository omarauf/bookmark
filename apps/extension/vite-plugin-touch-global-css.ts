import { utimesSync } from "node:fs";
import type { Plugin } from "vite";

function touchFile(filePath: string): void {
  const time = new Date();
  utimesSync(filePath, time, time);
}

type TouchGlobalCSSPluginOptions = {
  cssFilePath: string;
  watchFiles: string[];
};

export default function touchGlobalCSSPlugin({
  cssFilePath,
  watchFiles,
}: TouchGlobalCSSPluginOptions): Plugin {
  return {
    name: "touch-global-css",
    configureServer(server) {
      server.watcher.on("change", (file) => {
        var f = file.replace(/\\/g, "/");
        if (watchFiles.some((watchFile) => f.includes(watchFile))) {
          touchFile(cssFilePath);
        }
      });
    },
  };
}
