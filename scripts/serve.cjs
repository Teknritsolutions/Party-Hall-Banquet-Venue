const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const types = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".json": "application/json",
};
http
  .createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    let target = path.resolve(root, "." + url);
    if (!target.startsWith(root + path.sep) && target !== root) {
      res.writeHead(403);
      return res.end();
    }
    if (fs.existsSync(target) && fs.statSync(target).isDirectory())
      target = path.join(target, "pages/home1.html");
    fs.readFile(target, (error, data) => {
      res.writeHead(error ? 404 : 200, {
        "Content-Type": types[path.extname(target)] || "application/octet-stream",
      });
      res.end(error ? "Page not found" : data);
    });
  })
  .listen(4173, "127.0.0.1", () => console.log("The Grand Venue: http://127.0.0.1:4173"));
