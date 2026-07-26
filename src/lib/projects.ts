import { projects } from "content";

export type ProjectLang = "en" | "pt";

export type ProjectReference = {
	label: string;
	url: string;
};

export type ProjectMeta = {
	slug: string;
	title: string;
	type: string;
	summary: string;
	periodStart: string;
	periodEnd?: string;
	status: "public" | "private";
	stack: string[];
	repo?: string;
	demo?: string;
	cover?: string;
	coverAlt?: string;
	logo?: string;
	logoAlt?: string;
	wideMedia: boolean;
	references?: ProjectReference[];
	order: number;
	featured: boolean;
};

export type Project = ProjectMeta & {
	content: string;
};

const sortedProjects = [...projects]
	.filter((project) => !project.draft)
	.sort((a, b) => a.order - b.order);

function toMeta(
	project: (typeof sortedProjects)[number],
	lang: ProjectLang,
): ProjectMeta {
	return {
		slug: project.slug,
		title: project.title[lang],
		type: project.type[lang],
		summary: project.summary[lang],
		periodStart: project.periodStart,
		periodEnd: project.periodEnd,
		status: project.status,
		stack: project.stack,
		repo: project.repo,
		demo: project.demo,
		cover: project.cover,
		coverAlt: project.coverAlt?.[lang],
		logo: project.logo,
		logoAlt: project.logoAlt?.[lang],
		wideMedia: project.wideMedia,
		references: project.references,
		order: project.order,
		featured: project.featured,
	};
}

export function getAllProjects(lang: ProjectLang): ProjectMeta[] {
	return sortedProjects.map((project) => toMeta(project, lang));
}

export function getProjectBySlug(
	slug: string,
	lang: ProjectLang,
): Project | null {
	const project = sortedProjects.find((p) => p.slug === slug);
	if (!project) return null;

	return {
		...toMeta(project, lang),
		content: lang === "pt" ? project.contentPt : project.contentEn,
	};
}
