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
	content: string;
};

type Frontmatter = {
	title?: unknown;
	excerpt?: unknown;
	date?: unknown;
	tags?: unknown;
	cover?: unknown;
	draft?: unknown;
};

type InternalPost = BlogPost & {
	draft: boolean;
};

type ParsedFrontmatter = {
	data: Frontmatter;
	content: string;
};

const markdownModules = import.meta.glob("/posts/*.md", {
	eager: true,
	import: "default",
	query: "?raw",
}) as Record<string, string>;

const posts: InternalPost[] = [];

for (const [filePath, rawContent] of Object.entries(markdownModules)) {
	const parsedPost = parsePost(filePath, rawContent);
	if (!parsedPost || parsedPost.draft) continue;
	posts.push(parsedPost);
}

posts.sort(
	(a, b) =>
		new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
);

export function getAllPosts(): BlogPostMeta[] {
	return posts.map(({ content, draft, ...meta }) => meta);
}

export function getPostBySlug(slug: string): BlogPost | null {
	const post = posts.find((item) => item.slug === slug);
	if (!post) return null;
	const { draft: _draft, ...publicPost } = post;
	return publicPost;
}

function parsePost(filePath: string, rawContent: string): InternalPost | null {
	const { data: frontmatter, content } = parseFrontmatter(rawContent);
	const slug = slugFromPath(filePath);
	if (!slug) return null;

	const title =
		typeof frontmatter.title === "string" && frontmatter.title.trim().length > 0
			? frontmatter.title.trim()
			: humanizeSlug(slug);

	const excerpt =
		typeof frontmatter.excerpt === "string" &&
		frontmatter.excerpt.trim().length > 0
			? frontmatter.excerpt.trim()
			: buildExcerpt(content);

	const publishedAt =
		typeof frontmatter.date === "string" &&
		Number.isFinite(Date.parse(frontmatter.date))
			? frontmatter.date
			: new Date().toISOString();

	const tags = normalizeTags(frontmatter.tags);
	const readingTimeMinutes = getReadingTime(content);
	const cover =
		typeof frontmatter.cover === "string" && frontmatter.cover.trim().length > 0
			? frontmatter.cover
			: undefined;
	const draft = frontmatter.draft === true;

	return {
		slug,
		title,
		excerpt,
		publishedAt,
		tags,
		cover,
		readingTimeMinutes,
		content,
		draft,
	};
}

function slugFromPath(filePath: string): string {
	const fileName = filePath.split("/").pop()?.replace(/\.md$/, "") ?? "";
	const normalized = fileName.toLowerCase();
	return normalized.replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

function humanizeSlug(slug: string): string {
	return slug
		.split("-")
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

function normalizeTags(value: unknown): string[] {
	if (Array.isArray(value)) {
		return value
			.filter((item): item is string => typeof item === "string")
			.map((item) => item.trim())
			.filter(Boolean);
	}

	if (typeof value === "string") {
		return value
			.split(",")
			.map((item) => item.trim())
			.filter(Boolean);
	}

	return [];
}

function buildExcerpt(content: string): string {
	const normalized = content.replace(/\s+/g, " ").trim();
	if (normalized.length <= 160) return normalized;
	return `${normalized.slice(0, 157).trim()}...`;
}

function getReadingTime(content: string): number {
	const words = content.trim().split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.ceil(words / 220));
}

function parseFrontmatter(raw: string): ParsedFrontmatter {
	const normalized = raw.replace(/\r\n/g, "\n");
	if (!normalized.startsWith("---\n")) {
		return { data: {}, content: normalized };
	}

	const frontmatterEndIndex = normalized.indexOf("\n---\n", 4);
	if (frontmatterEndIndex === -1) {
		return { data: {}, content: normalized };
	}

	const frontmatterBlock = normalized.slice(4, frontmatterEndIndex);
	const content = normalized.slice(frontmatterEndIndex + 5).trimStart();
	const data = parseFrontmatterBlock(frontmatterBlock);

	return { data, content };
}

function parseFrontmatterBlock(block: string): Frontmatter {
	const data: Frontmatter = {};
	let activeArrayKey: keyof Frontmatter | null = null;

	for (const rawLine of block.split("\n")) {
		const line = rawLine.trimEnd();
		if (!line.trim() || line.trim().startsWith("#")) continue;

		const listMatch = line.match(/^\s*-\s+(.+)$/);
		if (listMatch && activeArrayKey) {
			const current = data[activeArrayKey];
			const nextValue = parseFrontmatterScalar(listMatch[1]);
			if (Array.isArray(current)) {
				current.push(String(nextValue));
			}
			continue;
		}

		const keyValueMatch = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
		if (!keyValueMatch) continue;

		const key = keyValueMatch[1] as keyof Frontmatter;
		const rawValue = keyValueMatch[2];

		if (rawValue.length === 0) {
			data[key] = [];
			activeArrayKey = key;
			continue;
		}

		data[key] = parseFrontmatterScalar(rawValue);
		activeArrayKey = null;
	}

	return data;
}

function parseFrontmatterScalar(value: string): unknown {
	const trimmed = value.trim();
	if (trimmed === "true") return true;
	if (trimmed === "false") return false;

	if (
		(trimmed.startsWith('"') && trimmed.endsWith('"')) ||
		(trimmed.startsWith("'") && trimmed.endsWith("'"))
	) {
		return trimmed.slice(1, -1);
	}

	return trimmed;
}
