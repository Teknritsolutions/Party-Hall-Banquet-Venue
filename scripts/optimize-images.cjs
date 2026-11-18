/* Optional authoring helper: originals are not needed for preview or builds. */
const { execFileSync } = require("node:child_process");
const path = require("node:path");
const fs = require("node:fs");
const items = require("./generated-images.json");
const sourceDirectory = process.argv[2];
if (sourceDirectory) {
  for (const item of items) {
    const source = path.resolve(sourceDirectory, item.original);
    if (!fs.existsSync(source)) throw new Error("Original not found: " + item.original);
    execFileSync("magick", [
      source,
      "-auto-orient",
      "-resize",
      "1400x1400>",
      "-quality",
      "82",
      item.file,
    ]);
  }
  console.log("Optimized " + items.length + " original photographs.");
}
for (const [name, size] of [
  ["favicon-32.png", 32],
  ["apple-touch-icon.png", 180],
  ["icon-192.png", 192],
  ["icon-512.png", 512],
]) {
  execFileSync("magick", [
    "-background",
    "none",
    "assets/images/favicon.svg",
    "-resize",
    size + "x" + size,
    "assets/images/" + name,
  ]);
}
console.log("PNG application icons generated.");
