import { defineConfig, s } from "velite";
import rehypeHighlight from "rehype-highlight";

export default defineConfig({
	root: ".",
	collections: {
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
