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

for (const encoding of ["br", "gzip"]) {
	const compressed = await fetch(`${base}/projects/pdv-fiscal`, { headers: { "Accept-Encoding": encoding } });
	assert.equal(compressed.headers.get("content-encoding"), encoding);
	assert.equal(compressed.headers.get("vary"), "Accept-Encoding");
	assert.match(compressed.headers.get("content-type"), /text\/html/);
	assert.ok((await compressed.text()).includes("Parió PDV"));
}
const identity = await fetch(`${base}/projects/pdv-fiscal`, { headers: { "Accept-Encoding": "br;q=0, gzip;q=0, identity" } });
assert.equal(identity.headers.get("content-encoding"), null);
const weighted = await fetch(`${base}/projects/pdv-fiscal`, { headers: { "Accept-Encoding": "br;q=0.2, gzip;q=1" } });
assert.equal(weighted.headers.get("content-encoding"), "gzip");
console.log("OK Brotli/gzip: decoded HTML, MIME type, Vary, quality negotiation and identity fallback");
for (const family of ["Geist", "GeistMono"]) {
	for (const variant of ["Latin-Variable", "Variable"]) {
		const font = await fetch(`${base}/fonts/geist/${family}-${variant}.woff2`);
		assert.equal(font.status, 200);
		assert.equal(font.headers.get("content-type"), "font/woff2");
	}
}
console.log("OK Latin and full fallback fonts: paths and WOFF2 MIME type");
console.log(`OK Linux/PM2: ${routes.length} routes, HTML, assets, HEAD, trailing slash, 404 and private files`);
