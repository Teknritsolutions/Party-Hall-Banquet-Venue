const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const root = path.resolve(__dirname, "..");
const walk = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
const files = walk(root).filter((p) => p.endsWith(".html") && !p.includes("reference-") && path.relative(root,p) !== "index.html");
let links = 0,
  photos = [];
const results = [];
for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  assert.equal(
    (html.match(/<h1[ >]/g) || []).length,
    1,
    path.relative(root, file) + " must contain one h1",
  );
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length, "Duplicate IDs " + file);
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const value = m[1];
    if (/^(https?:|mailto:|tel:|#|data:)/.test(value)) continue;
    const target = value.split(/[?#]/)[0];
    assert(
      fs.existsSync(path.resolve(path.dirname(file), target)),
      `Missing ${value} in ${path.relative(root, file)}`,
    );
    links++;
  }
  for (const m of html.matchAll(/<img[^>]+src="([^"]+\.webp)"[^>]*>/g)) {
    assert(/alt="[^"]+"/.test(m[0]), "Missing image alt");
    photos.push(path.resolve(path.dirname(file), m[1]));
  }
  const rel = path.relative(root, file).replaceAll("\\", "/");
  const count = (html.match(/<section\b/g) || []).length;
  if (rel === "pages/home1.html" || rel === "pages/home2.html")
    assert.equal(count, 10, rel + " section count");
  if (
    rel.startsWith("pages/") &&
    !/(home1|home2|login|register|forgot-password|404|coming-soon)\.html/.test(rel)
  )
    assert(count >= 5 && count <= 6, rel + " sections: " + count);
  if (rel.startsWith("dashboard/"))
    assert(
      !html.includes("site-header") && !html.includes("site-footer"),
      "Public shell in dashboard",
    );
  results.push({ file: rel, sections: count });
}
assert.equal(new Set(photos).size, photos.length, "Photo reused across pages or sections");
fs.writeFileSync(
  path.join(root, "documentation/static-test-results.json"),
  JSON.stringify(
    {
      pages: files.length,
      linksChecked: links,
      photoPlacements: photos.length,
      uniquePhotos: new Set(photos).size,
      results,
    },
    null,
    2,
  ),
);
console.log(
  `${files.length} HTML pages, ${links} local references, ${photos.length} unique photo placements: passed.`,
);
