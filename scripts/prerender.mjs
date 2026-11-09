// Snapshots the built SPA into real static HTML per route, so crawlers
// that don't execute JavaScript (most AI/LLM bots included) see actual
// content instead of an empty root. The route marker lets the browser hydrate
// only when the snapshot matches the requested URL.
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer";
import { preview } from "vite";
import { projects } from "../.velite/index.js";

const routes = ["/", "/projects", ...projects.filter((project) => !project.draft).map((project) => `/projects/${project.slug}`)];

function outputPathFor(route) {
	if (route === "/") return path.join("dist", "index.html");
	return path.join("dist", route.replace(/^\//, ""), "index.html");
}

async function main() {
	const snapshots = new Map();
	const server = await preview({
		preview: { port: 4321, strictPort: true },
	});
	const base = `http://localhost:4321`;

	let browser;
	try {
		browser = await puppeteer.launch({
		headless: true,
		// CI runners (GitHub Actions' ubuntu-latest) don't have unprivileged
		// user namespaces available for Chromium's sandbox.
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
		});
		for (const route of routes) {
			const page = await browser.newPage();
			await page.setRequestInterception(true);
			page.on("request", (request) => {
				if (new URL(request.url()).origin === base || request.url().startsWith("data:")) request.continue();
				else request.abort();
			});
			await page.goto(`${base}${route}`, { waitUntil: "networkidle0" });

			await page.waitForSelector("main h1");
			await page.evaluate(() => document.fonts.ready);
			await page.evaluate((route) => {
				document.getElementById("root").dataset.prerenderPath = route;
				if (route !== "/") {
					for (const link of document.head.querySelectorAll("link[rel='preload'][as='image']")) {
						if (["/images/kadu_logo.svg", "/images/kadu_logo_white.svg"].includes(link.getAttribute("href"))) link.remove();
					}
				}
				const coverPreload = document.head.querySelector("link[rel='preload'][as='image'][fetchpriority='high']");
				const fontPreload = document.head.querySelector("link[rel='preload'][as='font']");
				if (coverPreload && fontPreload) document.head.insertBefore(coverPreload, fontPreload);
				// Vite inserts absolute modulepreload URLs when lazy chunks load.
				// Snapshots must not retain the build server's origin.
				for (const element of document.querySelectorAll("[href], [src]")) {
					for (const attribute of ["href", "src"]) {
						const value = element.getAttribute(attribute);
						if (value?.startsWith(`${location.origin}/`)) {
							const url = new URL(value);
							element.setAttribute(attribute, `${url.pathname}${url.search}${url.hash}`);
						}
					}
				}
			}, route);

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
			snapshots.set(route, html);

			await page.close();
		}
	} finally {
		await browser?.close();
		await server.close();
	}
	// Capture every route against the original SPA shell. Writing the home
	// earlier would leak its modulepreloads into later routes via SPA fallback.
	for (const [route, html] of snapshots) {
		const outPath = outputPathFor(route);
		fs.mkdirSync(path.dirname(outPath), { recursive: true });
		fs.writeFileSync(outPath, html);
		console.log(`[prerender] ${route} -> ${outPath}`);
	}
}

main().catch((err) => {
	console.error("[prerender] failed:", err);
	process.exit(1);
});
