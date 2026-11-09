import assert from "node:assert/strict";
import { once } from "node:events";
import path from "node:path";
import puppeteer from "puppeteer";
import { projects } from "../.velite/index.js";
import { createStaticServer } from "./static-server.mjs";

const routes = ["/", "/projects", ...projects.filter((p) => !p.draft).map((p) => `/projects/${p.slug}`)];
const server = createStaticServer(path.resolve("dist"));
server.listen(0, "127.0.0.1");
await once(server, "listening");
const base = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
	browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
	for (const route of routes) {
		const response = await fetch(`${base}${route}`);
		assert.equal(response.status, 200, route);
		const html = await response.text();
		assert.ok(!html.includes("http://localhost:4321"), `${route} build origin`);
		assert.ok(html.includes(`data-prerender-path="${route}"`), route);
		assert.equal((html.match(/rel="canonical"/g) || []).length, 1, route);
		assert.ok(html.includes(`href="https://kadukessler.com${route === "/" ? "/" : route}"`), route);
		if (route.startsWith("/projects/")) {
			assert.ok(!/<link[^>]+href="[^"]*\/home-[^"]+\.js"/.test(html), `${route} must not preload the home chunk`);
			const project = projects.find((p) => route === `/projects/${p.slug}`);
			assert.ok(html.includes(project.title.en), route);
			assert.ok(html.includes(project.summary.en.replaceAll("&", "&amp;").replaceAll('"', "&quot;")), route);
		}
		const page = await browser.newPage();
		const errors = [];
		page.on("pageerror", (error) => errors.push(error.message));
		page.on("console", (message) => { if (message.type() === "error" && !message.text().includes("Failed to load resource")) errors.push(message.text()); });
		await page.setRequestInterception(true);
		page.on("request", (request) => request.url().startsWith(base) || request.url().startsWith("data:") ? request.continue() : request.abort());
		await page.goto(`${base}${route}`, { waitUntil: "networkidle0" });
		assert.equal(await page.$$eval("link[rel=canonical]", (els) => els.length), 1, route);
		await page.evaluate(() => localStorage.setItem("i18nextLng", "pt"));
		await page.reload({ waitUntil: "networkidle0" });
		assert.equal(await page.$eval("html", (el) => el.lang), "pt-BR", route);
		assert.deepEqual(errors, [], `${route} console`);
		await page.close();
		console.log(`OK ${route} (HTML, EN, PT, console)`);
	}
	const page = await browser.newPage();
	await page.setJavaScriptEnabled(false);
	await page.goto(`${base}/projects/pdv-fiscal`, { waitUntil: "networkidle0" });
	assert.equal(await page.$eval("h1", (el) => el.textContent), "Parió PDV");
	assert.equal(await page.$eval(".project-case-study", (el) => getComputedStyle(el.parentElement).opacity), "1");
	assert.ok((await page.$eval(".project-case-study", (el) => el.textContent)).includes("fiscal"));
	await page.close();
	console.log("OK project content visible without JavaScript");
	const interactivePage = await browser.newPage();
	await interactivePage.setViewport({ width: 390, height: 844 });
	await interactivePage.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "dark" }]);
	const navigationErrors = [];
	interactivePage.on("pageerror", (error) => navigationErrors.push(error.message));
	await interactivePage.goto(`${base}/projects/pdv-fiscal`, { waitUntil: "networkidle0" });
	assert.equal(await interactivePage.$eval("html", (el) => el.classList.contains("dark")), true);

	await interactivePage.click("a[href='/projects']");
	await interactivePage.waitForFunction(() => location.pathname === "/projects" && document.title === "Projects | Kadu Kessler");
	assert.equal(await interactivePage.$$eval("link[rel=canonical]", (els) => els.length), 1);
	await interactivePage.click("a[href='/#projects']");
	await interactivePage.waitForFunction(() => location.pathname === "/" && document.title === "Kadu Kessler | Full-Stack Developer");
	assert.equal(await interactivePage.$$eval("link[rel=canonical]", (els) => els.length), 1);
	assert.deepEqual(navigationErrors, []);
	await interactivePage.close();
	console.log("OK mobile dark theme and client navigation: project -> projects -> home");
	for (const route of ["/projects/", "/projects/pdv-fiscal/"]) assert.equal((await fetch(`${base}${route}`)).status, 200);
	for (const route of ["/missing", "/assets/missing.js", "/.server/server.mjs", "/%2e%2e%2fpackage.json"]) assert.equal((await fetch(`${base}${route}`)).status, 404, route);
	assert.equal((await fetch(`${base}/projects`, { method: "HEAD" })).status, 200);
	assert.equal((await fetch(`${base}/projects`, { method: "POST" })).status, 405);
	assert.equal((await fetch(`${base}/%ZZ`)).status, 400);
	console.log("OK server: trailing slash, HEAD, 404, private files, invalid URL, methods");
} finally {
	await browser?.close();
	server.closeAllConnections();
	await new Promise((resolve) => server.close(resolve));
}
