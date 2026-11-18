# Installation and deployment

1. Keep the folder structure intact. No runtime installation is required.
2. Use Node.js 20+ and run `npm start` from the project root.
3. Open http://127.0.0.1:4173. Use an HTTP server for consistent localStorage behavior; avoid relying on file://.
4. For static hosting, upload index.html, index-2.html, pages/, dashboard/, assets/, documentation/legal.html, manifest.webmanifest, sitemap.xml and robots.txt, preserving directory relationships.
5. Replace example.com in canonical/OG metadata and sitemap, set the real business identity and configure the host's 404 mapping. No external hosting account was created or deployed by this task.
6. Review all demo disclosures before replacing them with actual integrated services. Do not expose the admin demonstration as a production admin system.

The server only reads within the project root and binds to 127.0.0.1 on port 4173. Stop it with Ctrl+C. The image optimization helper accepts a directory containing the original generated PNG filenames listed in scripts/generated-images.json; the delivered WebPs are already optimized, so this helper is not needed for installation or HTML builds.

