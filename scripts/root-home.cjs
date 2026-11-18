const fs = require("node:fs");

// Publish Home 1 directly at the root, with paths relative to index.html.
const html = fs.readFileSync("pages/home1.html", "utf8")
  .replace(/\b(href|src|action)="([^"]*)"/g, (match, attribute, value) => {
    if (!value || /^(?:[a-z][a-z0-9+.-]*:|\/|#)/i.test(value)) return match;
    const resolved = new URL(value, "https://local.invalid/pages/home1.html");
    return `${attribute}="${resolved.pathname.slice(1)}${resolved.search}${resolved.hash}"`;
  })
  .replace('data-root="../"', 'data-root="./"')
  .replaceAll("https://example.com/pages/home1.html", "https://teknritsolutions.github.io/Party-Hall-Banquet-Venue/");

fs.writeFileSync("index.html", html);
console.log("Published Home 1 at index.html");
