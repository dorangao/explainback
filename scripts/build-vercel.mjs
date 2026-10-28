import { build } from "vite";
import { mkdir, copyFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { brandFiles } from "../src/static.mjs";
await build();
for (const [path] of brandFiles) {
  await mkdir(dirname(fileURLToPath(new URL("../dist" + path, import.meta.url))), {
    recursive: true,
  });
  await copyFile(
    new URL("../public" + path, import.meta.url),
    new URL("../dist" + path, import.meta.url),
  );
}
await writeFile(
  new URL("../dist/robots.txt", import.meta.url),
  "User-agent: *\nDisallow: /\n",
);
console.log("Built React frontend and public brand assets.");
