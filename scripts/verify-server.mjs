import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || "dist");
const base = process.argv[3] || "http://127.0.0.1:3000";
for (let attempt = 0; ; attempt++) {
	try { await fetch(base); break; }
	catch (error) { if (attempt === 25) throw error; await new Promise((resolve) => setTimeout(resolve, 200)); }
}
const routes = ["/", "/projects", ...fs.readdirSync(path.join(root, "projects"), { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => `/projects/${entry.name}`)];
for (const route of routes) {
	const response = await fetch(`${base}${route}`);
	assert.equal(response.status, 200, route);
	assert.match(response.headers.get("content-type"), /text\/html/);
	assert.ok((await response.text()).includes(`data-prerender-path="${route}"`), route);
}
assert.equal((await fetch(`${base}/projects/pdv-fiscal/`)).status, 200);
assert.equal((await fetch(`${base}/projects`, { method: "HEAD" })).status, 200);
assert.equal((await fetch(`${base}/missing`)).status, 404);
assert.equal((await fetch(`${base}/.server/server.mjs`)).status, 404);
const asset = fs.readdirSync(path.join(root, "assets")).find((file) => file.endsWith(".js"));
const response = await fetch(`${base}/assets/${asset}`);
assert.equal(response.status, 200);
assert.match(response.headers.get("content-type"), /javascript/);
assert.match(response.headers.get("cache-control"), /immutable/);

console.log(`OK Linux/PM2: ${routes.length} routes, HTML, assets, HEAD, trailing slash, 404 and private files`);
