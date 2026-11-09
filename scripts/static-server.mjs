import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";

const mimeTypes = {
	".html": "text/html; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".webmanifest": "application/manifest+json",
	".svg": "image/svg+xml",
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".webp": "image/webp",
	".ico": "image/x-icon",
	".woff2": "font/woff2",
	".txt": "text/plain; charset=utf-8",
	".xml": "application/xml; charset=utf-8",
};

export function createStaticServer(rootDirectory) {
	const root = path.resolve(rootDirectory);
	return createServer(async (request, response) => {
		if (request.method !== "GET" && request.method !== "HEAD") {
			response.writeHead(405, { Allow: "GET, HEAD" }).end();
			return;
		}
		try {
			const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
			const segments = pathname.split(/[\\/]/);
			if (segments.some((segment) => segment.startsWith(".")) || pathname.includes("\0")) {
				response.writeHead(404).end();
				return;
			}
			let file = path.resolve(root, `.${pathname}`);
			if (file !== root && !file.startsWith(`${root}${path.sep}`)) {
				response.writeHead(404).end();
				return;
			}
			let info = await stat(file).catch(() => null);
			if (info?.isDirectory()) {
				file = path.join(file, "index.html");
				info = await stat(file).catch(() => null);
			}
			let status = 200;
			if (!info?.isFile()) {
				status = 404;
				file = path.join(root, "404.html");
				info = await stat(file);
			}
			const contentType = mimeTypes[path.extname(file)] ?? "application/octet-stream";
			const accepted = new Map((request.headers["accept-encoding"] || "").split(",").map((entry) => {
				const [encoding, ...parameters] = entry.trim().toLowerCase().split(";");
				const quality = parameters.find((parameter) => parameter.trim().startsWith("q="));
				return [encoding, quality ? Number(quality.trim().slice(2)) : 1];
			}));
			const quality = (encoding) => accepted.get(encoding) ?? accepted.get("*") ?? 0;
			let contentEncoding;
			for (const encoding of ["br", "gzip"].filter((encoding) => quality(encoding) > 0).sort((a, b) => quality(b) - quality(a))) {
				const compressedFile = `${file}.${encoding === "br" ? "br" : "gz"}`;
				const compressedInfo = await stat(compressedFile).catch(() => null);
				if (compressedInfo?.isFile()) {
					file = compressedFile;
					info = compressedInfo;
					contentEncoding = encoding;
					break;
				}
			}
			response.writeHead(status, {
				"Content-Type": contentType,
				...(contentEncoding ? { "Content-Encoding": contentEncoding } : {}),
				Vary: "Accept-Encoding",
				"Content-Length": info.size,
				"Cache-Control": status === 200 && pathname.startsWith("/assets/")
					? "public, max-age=31536000, immutable" : "no-cache",
				"X-Content-Type-Options": "nosniff",
			});
			if (request.method === "HEAD") response.end();
			else createReadStream(file).on("error", () => response.destroy()).pipe(response);
		} catch (error) {
			response.writeHead(error instanceof URIError ? 400 : 500).end();
		}
	});
}
