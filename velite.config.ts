import { defineConfig, s } from "velite";
import rehypeHighlight from "rehype-highlight";

export default defineConfig({
	root: ".",
	collections: {
		projects: {
			name: "Project",
			pattern: "projects/**/*.mdx",
			schema: s
				.object({
					title: s.object({ en: s.string(), pt: s.string() }),
					type: s.object({ en: s.string(), pt: s.string() }),
					summary: s.object({ en: s.string(), pt: s.string() }),
					periodStart: s.string(),
					periodEnd: s.string().optional(),
					status: s.enum(["public", "private"]),
					stack: s.array(s.string()),
					repo: s.string().optional(),
					demo: s.string().optional(),
					cover: s.string().optional(),
					coverAlt: s.object({ en: s.string(), pt: s.string() }).optional(),
					logo: s.string().optional(),
					logoAlt: s.object({ en: s.string(), pt: s.string() }).optional(),
					wideMedia: s.boolean().default(false),
					references: s
						.array(s.object({ label: s.string(), url: s.string() }))
						.optional(),
					order: s.number().default(99),
					featured: s.boolean().default(false),
					draft: s.boolean().default(false),
					contentEn: s.mdx(),
					contentPt: s.mdx(),
				})
				.transform((data, { meta }) => {
					const fileName = meta.path.split(/[\\/]/).pop() ?? "";
					const slug = fileName.replace(/\.mdx$/, "").toLowerCase();
					return {
						...data,
						slug,
						permalink: `/projects/${slug}`,
					};
				}),
		},
		posts: {
			name: "Post",
			pattern: "posts/**/*.mdx",
			schema: s
				.object({
					title: s.string(),
					date: s.isodate(),
					excerpt: s.excerpt(),
					tags: s.array(s.string()),
					cover: s.string().optional(),
					draft: s.boolean().default(false),
					metadata: s.metadata(),
					content: s.mdx(),
				})
				.transform((data, { meta }) => {
					// Pega apenas o nome do arquivo, independente do SO
					const fileName = meta.path.split(/[\\/]/).pop() ?? "";
					const slug = fileName
						.replace(/\.mdx$/, "")
						.replace(/^\d{4}-\d{2}-\d{2}-/, "")
						.toLowerCase();
					return {
						...data,
						slug,
						permalink: `/blog/${slug}`,
					};
				}),
		},
	},
	mdx: {
		rehypePlugins: [rehypeHighlight],
	},
});
