import { posts } from "content";

export type BlogPostMeta = {
	slug: string;
	title: string;
	excerpt: string;
	publishedAt: string;
	tags: string[];
	cover?: string;
	readingTimeMinutes: number;
};

export type BlogPost = BlogPostMeta & {
	content: string; // O Velite entrega o conteúdo processado
};

// Ordena os posts por data decrescente
const sortedPosts = [...posts].sort(
	(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

export function getAllPosts(): BlogPostMeta[] {
	return sortedPosts
		.filter((post) => !post.draft)
		.map((post) => ({
			slug: post.slug,
			title: post.title,
			excerpt: post.excerpt,
			publishedAt: post.date,
			tags: post.tags.map((t) => t.toLowerCase()),
			cover: post.cover,
			readingTimeMinutes: Math.ceil(post.metadata.readingTime),
		}));
}

export function getAllTags(): string[] {
	const tags = new Set<string>();
	for (const post of sortedPosts) {
		if (post.draft) continue;
		for (const tag of post.tags) {
			tags.add(tag.toLowerCase());
		}
	}
	return Array.from(tags).sort();
}

export function getPostBySlug(slug: string): BlogPost | null {
	const post = sortedPosts.find((p) => p.slug === slug);
	if (!post) return null;

	return {
		slug: post.slug,
		title: post.title,
		excerpt: post.excerpt,
		publishedAt: post.date,
		tags: post.tags.map((t) => t.toLowerCase()),
		cover: post.cover,
		readingTimeMinutes: Math.ceil(post.metadata.readingTime),
		content: post.content,
	};
}
