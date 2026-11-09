import fs from "node:fs";
import path from "node:path";
import { brotliCompressSync, constants, gzipSync } from "node:zlib";

fs.mkdirSync("dist/.server", { recursive: true });
fs.copyFileSync("scripts/static-server.mjs", "dist/.server/static-server.mjs");
fs.copyFileSync("scripts/start-server.mjs", "dist/.server/server.mjs");
fs.copyFileSync("scripts/verify-server.mjs", "dist/.server/verify-server.mjs");
fs.copyFileSync("dist/index.html", "dist/404.html");

function compressDirectory(directory) {
	for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
		if (entry.name.startsWith(".")) continue;
		const file = path.join(directory, entry.name);
		if (entry.isDirectory()) compressDirectory(file);
		else if (/\.(html|js|css|json|svg|xml|txt|webmanifest)$/.test(file)) {
			const content = fs.readFileSync(file);
			fs.writeFileSync(`${file}.br`, brotliCompressSync(content, { params: { [constants.BROTLI_PARAM_QUALITY]: 5 } }));
			fs.writeFileSync(`${file}.gz`, gzipSync(content, { level: 6 }));
		}
	}
}
compressDirectory("dist");
