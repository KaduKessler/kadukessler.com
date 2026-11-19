// Builds the share images (Open Graph / Twitter cards) as 1200x630 JPEGs.
//
// Why: the case covers are WebP screenshots with arbitrary proportions. Some
// networks (LinkedIn, parts of Facebook) do not render WebP, and every network
// crops to ~1.91:1, which cut the bottom of the screenshots. Here each cover is
// placed whole on a blurred, darkened copy of itself, so nothing is cropped.
//
// Run `pnpm og` after changing a cover, then commit the output.
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { projects } from "../.velite/index.js";

const W = 1200;
const H = 630;
const PAD = 48;
const OUT = "public/images/og";
const MAX_BYTES = 200 * 1024;

const jpeg = (img, quality = 82) =>
	img.jpeg({ quality, mozjpeg: true, progressive: true });

async function roundCorners(buffer, radius) {
	const { width, height } = await sharp(buffer).metadata();
	const mask = Buffer.from(
		`<svg width="${width}" height="${height}"><rect width="${width}" height="${height}" rx="${radius}" ry="${radius}"/></svg>`,
	);
	return sharp(buffer)
		.ensureAlpha()
		.composite([{ input: mask, blend: "dest-in" }])
		.png()
		.toBuffer();
}

async function fromCover(file) {
	const background = await sharp(file)
		.resize(W, H, { fit: "cover" })
		.blur(32)
		.modulate({ brightness: 0.45 })
		.toBuffer();
	const resized = await sharp(file)
		.resize(W - 2 * PAD, H - 2 * PAD, { fit: "inside" })
		.toBuffer();
	const foreground = await roundCorners(resized, 14);
	return sharp(background).composite([{ input: foreground, gravity: "center" }]);
}

async function fromLogo(file) {
	const logo = await sharp(file, { density: 300 })
		.resize({ height: 280, fit: "inside" })
		.png()
		.toBuffer();
	return sharp({
		create: { width: W, height: H, channels: 3, background: "#0a0a0a" },
	}).composite([{ input: logo, gravity: "center" }]);
}

async function write(name, image) {
	let quality = 84;
	let buffer = await jpeg(image.clone(), quality).toBuffer();
	while (buffer.length > MAX_BYTES && quality > 55) {
		quality -= 6;
		buffer = await jpeg(image.clone(), quality).toBuffer();
	}
	await fs.writeFile(path.join(OUT, `${name}.jpg`), buffer);
	console.log(
		`${name}.jpg  ${(buffer.length / 1024).toFixed(0)} KB  (q${quality})`,
	);
}

await fs.mkdir(OUT, { recursive: true });

// public/images/og/home.jpg is not generated here: it is a screenshot of
// scripts/og-home.html (name, role and stack chips) taken at 1200x630.

for (const project of projects.filter((p) => !p.draft)) {
	const source = project.cover ?? project.logo;
	if (!source) continue;
	const file = path.join("public", source);
	const image = project.cover ? await fromCover(file) : await fromLogo(file);
	await write(project.slug, image);
}
