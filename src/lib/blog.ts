import matter from "gray-matter";
import type { ComponentType } from "react";

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
	Content: ComponentType<{ components?: Record<string, React.ComponentType> }>;
};

const mdxModules = import.meta.glob("/posts/*.mdx", {
	eager: true,
}) as Record<string, { default: BlogPost["Content"]; [key: string]: unknown }>;

const rawModules = import.meta.glob("/posts/*.mdx", {
	eager: true,
	query: "?raw",
	import: "default",
}) as Record<string, string | (() => string)>;

const posts: (BlogPost & { draft: boolean })[] = [];

for (const [filePath, module] of Object.entries(mdxModules)) {
	const slug = slugFromPath(filePath);
	if (!slug) continue;

	let rawContent = rawModules[filePath];
	if (typeof rawContent === "function") {
		rawContent = rawContent();
	}

	let cleanContent = "";
	let data: Record<string, unknown> = {};

	if (typeof rawContent === "string" && rawContent.length > 0) {
		const parsed = matter(rawContent);
		data = parsed.data;
		cleanContent = parsed.content;
	}

	// Prioridade: gray-matter (raw) > module.frontmatter (MDX plugin) > module (root)
	const fm = data || {};
	const mfm = (module.frontmatter as Record<string, unknown>) || {};

	const title =
		(fm.title as string) ||
		(mfm.title as string) ||
		(module.title as string) ||
		humanizeSlug(slug);
	const dateValue = fm.date || mfm.date || module.date;
	const publishedAt =
		(dateValue instanceof Date
			? dateValue.toISOString()
			: (dateValue as string)) || new Date().toISOString();
	const tags = normalizeTags(fm.tags || mfm.tags || module.tags);
	const excerpt =
		(fm.excerpt as string) ||
		(mfm.excerpt as string) ||
		(module.excerpt as string) ||
		(cleanContent ? buildExcerpt(cleanContent) : "");
	const cover =
		(fm.cover as string) || (mfm.cover as string) || (module.cover as string);
	const draft =
		fm.draft === true || mfm.draft === true || module.draft === true;
	const readingTimeMinutes =
		(fm.readingTimeMinutes as number) ||
		(mfm.readingTimeMinutes as number) ||
		(cleanContent ? getReadingTime(cleanContent) : 5);

	posts.push({
		slug,
		title,
		excerpt,
		publishedAt,
		tags,
		cover,
		readingTimeMinutes,
		Content: module.default as BlogPost["Content"],
		draft,
	});
}

posts.sort(
	(a, b) =>
		new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
);

export function getAllPosts(): BlogPostMeta[] {
	return posts.map(({ Content, draft, ...meta }) => meta);
}

export function getAllTags(): string[] {
	const tags = new Set<string>();
	for (const post of posts) {
		if (post.draft) continue;
		for (const tag of post.tags) {
			tags.add(tag); // As tags já vêm normalizadas para lowercase de normalizeTags
		}
	}
	return Array.from(tags).sort();
}

export function getPostBySlug(slug: string): BlogPost | null {
	const post = posts.find((item) => item.slug === slug);
	if (!post) return null;
	const { draft: _draft, ...publicPost } = post;
	return publicPost;
}

function slugFromPath(filePath: string): string {
	const fileName =
		filePath
			.split("/")
			.pop()
			?.replace(/\.mdx$/, "") ?? "";
	return fileName.toLowerCase().replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

function humanizeSlug(slug: string): string {
	return slug
		.split("-")
		.filter(Boolean)
		.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
		.join(" ");
}

function normalizeTags(value: unknown): string[] {
	let rawTags: string[] = [];

	if (Array.isArray(value)) {
		rawTags = value.filter((item): item is string => typeof item === "string");
	} else if (typeof value === "string") {
		rawTags = value.split(",");
	}

	return rawTags
		.map((tag) => tag.trim().toLowerCase()) // Normaliza para lowercase para evitar duplicatas por case
		.filter(Boolean);
}

function buildExcerpt(content: string): string {
	if (!content) return "";
	const plainText = content
		.replace(/import[\s\S]*?from\s+['"].*?['"];?/g, "")
		.replace(/export\s+const\s+[\s\S]*?;/g, "")
		.replace(/#+\s+.*/g, "")
		.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
		.replace(/[`*_]/g, "")
		.replace(/<[\s\S]*?>/g, "")
		.replace(/\s+/g, " ")
		.trim();
	return plainText.length <= 160
		? plainText
		: `${plainText.slice(0, 157).trim()}...`;
}

function getReadingTime(content: string): number {
	if (!content) return 1;
	const words = content.trim().split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.ceil(words / 220));
}
