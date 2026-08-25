// Snapshots the built SPA into real static HTML per route, so crawlers
// that don't execute JavaScript (most AI/LLM bots included) see actual
// content instead of an empty <div id="root">. Doesn't touch the shipped
// JS bundle or how real browsers hydrate — only the initial HTML payload
// gains pre-rendered content.
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer";
import { preview } from "vite";
// import { posts, projects } from "../.velite/index.js"; -- needed again
// once the routes list below is restored, see comment.

// TEMPORARY: only "/" for now. Prerendering /projects and /projects/:slug
// writes dist/projects/<slug>/index.html — pm2's static server can't
// resolve a directory to its index.html (throws EISDIR, 500s the route,
// worse than the pre-prerender SPA-fallback 200 it replaced). Broke
// production on first deploy. Restore the full route list (see git log
// for this file) once the server side is fixed — e.g. swap pm2 serve for
// the `serve` package — and verified against a real deploy.
const routes = ["/"];

function outputPathFor(route) {
	if (route === "/") return path.join("dist", "index.html");
	return path.join("dist", route.replace(/^\//, ""), "index.html");
}

async function main() {
	const server = await preview({
		preview: { port: 4321, strictPort: true },
	});
	const base = `http://localhost:4321`;

	const browser = await puppeteer.launch({
		headless: true,
		// CI runners (GitHub Actions' ubuntu-latest) don't have unprivileged
		// user namespaces available for Chromium's sandbox.
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
	});

	try {
		for (const route of routes) {
			const page = await browser.newPage();
			await page.goto(`${base}${route}`, { waitUntil: "networkidle0" });

			// main.tsx dispatches this ~1s after mount; race it against a
			// hard cap so one slow route can't hang the whole build.
			await page.evaluate(
				() =>
					new Promise((resolve) => {
						document.addEventListener("render-event", () => resolve(), {
							once: true,
						});
						setTimeout(resolve, 3000);
					}),
			);

			// React 19 hoists per-route <title>/<meta>/<link> rendered by
			// project-detail.tsx / blog-post.tsx into <head> alongside the
			// static ones already in index.html, instead of replacing them.
			// Keep only the one that actually wins in a real browser so
			// crawlers see the same thing document.title/etc. resolve to.
			// Empirically: React's <title> is hoisted BEFORE the static one
			// (matches document.title), but its <meta>/<link> land AFTER.
			await page.evaluate(() => {
				const dedupe = (selector, keyFn, keep) => {
					const seen = new Map();
					for (const el of document.head.querySelectorAll(selector)) {
						const key = keyFn(el);
						const prev = seen.get(key);
						if (prev) {
							(keep === "first" ? el : prev).remove();
						}
						seen.set(key, el);
					}
				};
				dedupe("title", () => "title", "first");
				dedupe(
					"meta[name]",
					(el) => `name:${el.getAttribute("name")}`,
					"last",
				);
				dedupe(
					"meta[property]",
					(el) => `property:${el.getAttribute("property")}`,
					"last",
				);
				dedupe("link[rel='canonical']", () => "canonical", "last");
			});

			const html = await page.content();
			const outPath = outputPathFor(route);
			fs.mkdirSync(path.dirname(outPath), { recursive: true });
			fs.writeFileSync(outPath, html);
			console.log(`[prerender] ${route} -> ${outPath}`);

			await page.close();
		}
	} finally {
		await browser.close();
		await server.close();
	}
}

main().catch((err) => {
	console.error("[prerender] failed:", err);
	process.exit(1);
});
