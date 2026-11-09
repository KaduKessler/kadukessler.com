import fs from "node:fs";

fs.mkdirSync("dist/.server", { recursive: true });
fs.copyFileSync("scripts/static-server.mjs", "dist/.server/static-server.mjs");
fs.copyFileSync("scripts/start-server.mjs", "dist/.server/server.mjs");
fs.copyFileSync("scripts/verify-server.mjs", "dist/.server/verify-server.mjs");
fs.copyFileSync("dist/index.html", "dist/404.html");
