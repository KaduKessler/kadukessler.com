import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import generateSitemap from "vite-plugin-sitemap";
import { posts } from "./.velite";

const blogRoutes = posts.map((post) => `blog/${post.slug}`);
const dynamicRoutes = ["blog", ...blogRoutes];

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		generateSitemap({
			hostname: "https://kadukessler.com",
			dynamicRoutes: dynamicRoutes,
			changefreq: "weekly",
			priority: 0.8,
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			content: path.resolve(__dirname, "./.velite"),
		},
	},
});
