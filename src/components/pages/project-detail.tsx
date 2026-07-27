import {
	ArrowLeft,
	ChevronLeft,
	ChevronRight,
	ExternalLink,
	Lock,
	SquareArrowOutUpRight,
	X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
	Children,
	cloneElement,
	isValidElement,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Footer } from "@/components/sections/footer";
import { Background } from "@/components/ui/background";
import { FadeInImage } from "@/components/ui/fade-in-image";
import { LanguageReveal } from "@/components/ui/language-reveal";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { MDXContent } from "@/components/ui/mdx-content";
import { SectionReveal } from "@/components/ui/section-reveal";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";

import "highlight.js/styles/github-dark.css";

type LightboxImage = { src: string; alt?: string };

function Lightbox({
	image,
	onClose,
}: {
	image: LightboxImage;
	onClose: () => void;
}) {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [onClose]);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			onClick={onClose}
			className="fixed inset-0 z-100 flex cursor-zoom-out items-center justify-center bg-background/95 p-4 backdrop-blur-lg sm:p-10"
		>
			<button
				type="button"
				onClick={onClose}
				className="absolute top-6 right-6 rounded-full border border-border bg-card p-2.5 text-muted-foreground transition-colors hover:text-foreground"
				aria-label="Close"
			>
				<X className="size-5" />
			</button>
			<motion.img
				initial={{ scale: 0.97, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.97, opacity: 0 }}
				transition={{ type: "spring", damping: 26, stiffness: 300 }}
				src={image.src}
				alt={image.alt ?? ""}
				className="max-h-full max-w-full cursor-default rounded-lg object-contain shadow-2xl"
				onClick={(e) => e.stopPropagation()}
			/>
			{image.alt && (
				<motion.p
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 8 }}
					className="absolute bottom-8 left-1/2 max-w-xl -translate-x-1/2 rounded-full border border-border bg-card/90 px-4 py-2 text-center text-xs text-muted-foreground backdrop-blur-md"
				>
					{image.alt}
				</motion.p>
			)}
		</motion.div>
	);
}

function SidebarLabel({ children }: { children: React.ReactNode }) {
	return (
		<span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
			{children}
		</span>
	);
}

export function ProjectDetail() {
	const { t, i18n } = useTranslation();
	const { slug } = useParams();
	const navigate = useNavigate();
	const lang = i18n.language.startsWith("pt") ? "pt" : "en";
	const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(
		null,
	);

	const openLightbox = useCallback((image: LightboxImage) => {
		setLightboxImage(image);
	}, []);

	const project = useMemo(
		() => (slug ? getProjectBySlug(slug, lang) : null),
		[slug, lang],
	);

	const mdxComponents = useMemo(
		() => ({
			a: ({
				children,
				href,
				...props
			}: {
				children?: React.ReactNode;
				href?: string;
				[key: string]: unknown;
			}) => {
				const isExternal = href?.startsWith("http");
				return (
					<a
						href={href}
						className="font-medium text-foreground underline decoration-border decoration-1 underline-offset-4 transition-colors hover:decoration-foreground"
						target={isExternal ? "_blank" : undefined}
						rel={isExternal ? "noopener noreferrer" : undefined}
						{...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
					>
						{children}
					</a>
				);
			},
			img: ({
				src,
				alt,
				grid,
			}: React.ImgHTMLAttributes<HTMLImageElement> & { grid?: boolean }) => {
				if (!src || typeof src !== "string") return null;
				const isExternal = /^https?:\/\//.test(src);
				return (
					<button
						type="button"
						onClick={() => openLightbox({ src, alt })}
						className={`group block w-full appearance-none cursor-zoom-in overflow-hidden rounded-xl border border-border ${grid ? "" : project?.wideMedia ? "max-w-2xl" : "max-w-md"}`}
					>
						<FadeInImage
							src={src}
							alt={alt ?? ""}
							containerClassName={grid ? "aspect-video" : isExternal ? "min-h-0" : undefined}
							imgClassName={
								grid
									? "h-full w-full object-cover object-top group-hover:scale-105"
									: "w-full group-hover:scale-[1.02]"
							}
						/>
					</button>
				);
			},
			p: ({ children }: { children?: React.ReactNode }) => {
				const meaningful = Children.toArray(children).filter(
					(child) => !(typeof child === "string" && child.trim() === ""),
				);
				const images = meaningful.filter(
					(child) =>
						isValidElement(child) &&
						"src" in (child.props as Record<string, unknown>),
				);
				const isImageParagraph =
					images.length > 0 && images.length === meaningful.length;

				if (isImageParagraph && images.length > 1) {
					return (
						<div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
							{images.map((child, i) =>
								isValidElement(child)
									? cloneElement(
											child as React.ReactElement<{ grid?: boolean }>,
											{ key: i, grid: true },
										)
									: child,
							)}
						</div>
					);
				}
				if (isImageParagraph) {
					return <div className="my-6">{children}</div>;
				}
				return <p>{children}</p>;
			},
		}),
		[openLightbox, project?.wideMedia],
	);

	const allProjects = useMemo(() => getAllProjects(lang), [lang]);
	const projectIndex = allProjects.findIndex((p) => p.slug === slug);

	const prevProject =
		projectIndex >= 0 && allProjects.length > 1
			? allProjects[
					(projectIndex - 1 + allProjects.length) % allProjects.length
				]
			: null;
	const nextProject =
		projectIndex >= 0 && allProjects.length > 1
			? allProjects[(projectIndex + 1) % allProjects.length]
			: null;

	useEffect(() => {
		if (!project && slug) {
			navigate("/projects", { replace: true });
			return;
		}
		window.scrollTo(0, 0);
	}, [project, slug, navigate]);

	if (!project) return null;

	const periodLabel = `${project.periodStart} — ${project.periodEnd ?? t("projects.present")}`;
	const showNoLinkNote =
		project.status === "private" && !project.repo && !project.demo;

	return (
		<div className="min-h-screen bg-background">
			<Background />
			<Helmet>
				<title>{project.title} — Kadu Kessler</title>
				<meta name="description" content={project.summary} />
				<link
					rel="canonical"
					href={`https://kadukessler.com/projects/${project.slug}`}
				/>
			</Helmet>

			<AnimatePresence>
				{lightboxImage && (
					<Lightbox
						image={lightboxImage}
						onClose={() => setLightboxImage(null)}
					/>
				)}
			</AnimatePresence>

			<main className="relative mx-auto flex max-w-2xl flex-col gap-10 px-4 pt-10 pb-16 sm:px-6 sm:pt-14 sm:pb-24 lg:max-w-5xl">
				<SectionReveal>
					<nav className="flex items-center justify-between">
						<Link
							to="/projects"
							className="group flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
						>
							<ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
							<LanguageReveal inline>{t("projects.back")}</LanguageReveal>
						</Link>
						<div className="flex items-center gap-1">
							<LanguageToggle />
							<ThemeToggle />
						</div>
					</nav>
				</SectionReveal>

				<SectionReveal delay={0.05}>
					<div className="relative flex flex-col gap-4">
						{projectIndex >= 0 && (
							<span
								aria-hidden
								className="pointer-events-none absolute -top-6 right-0 -z-10 select-none font-mono text-[6rem] font-bold leading-none tracking-tighter text-foreground/[0.05] sm:-top-10 sm:text-[8rem]"
							>
								{String(projectIndex + 1).padStart(2, "0")}
							</span>
						)}

						<div className="flex items-center gap-3">
							{project.logo && (
								<button
									type="button"
									onClick={() =>
										project.logo &&
										openLightbox({ src: project.logo, alt: project.logoAlt })
									}
									className="flex h-6 shrink-0 cursor-zoom-in items-center opacity-80 transition-opacity hover:opacity-100"
								>
									<img
										src={project.logo}
										alt={project.logoAlt ?? ""}
										className="h-full w-auto max-w-28 object-contain"
									/>
								</button>
							)}
							<SidebarLabel>{project.type}</SidebarLabel>
							<span className="h-px flex-1 bg-border" />
							{prevProject && nextProject && (
								<div className="flex items-center gap-1">
									<Link
										to={`/projects/${prevProject.slug}`}
										aria-label={prevProject.title}
										className="flex size-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
									>
										<ChevronLeft className="size-3.5" />
									</Link>
									<span className="font-mono text-[10px] text-muted-foreground/50">
										{String(projectIndex + 1).padStart(2, "0")}/
										{String(allProjects.length).padStart(2, "0")}
									</span>
									<Link
										to={`/projects/${nextProject.slug}`}
										aria-label={nextProject.title}
										className="flex size-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
									>
										<ChevronRight className="size-3.5" />
									</Link>
								</div>
							)}
						</div>

						<h1 className="max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
							{project.title}
						</h1>
						<p className="max-w-prose text-sm leading-relaxed text-foreground/80">
							{project.summary}
						</p>
					</div>
				</SectionReveal>

				<div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
					<SectionReveal
						delay={0.08}
						className="flex flex-col gap-5 rounded-xl border border-border bg-card p-4 lg:sticky lg:top-28"
					>
						<div className="flex flex-col gap-1.5">
							<SidebarLabel>
								<LanguageReveal inline>{t("projects.timeline")}</LanguageReveal>
							</SidebarLabel>
							<span className="font-mono text-[13px] text-foreground">
								{periodLabel}
							</span>
						</div>

						<div className="flex flex-col gap-1.5">
							<SidebarLabel>
								<LanguageReveal inline>{t("projects.status")}</LanguageReveal>
							</SidebarLabel>
							<span className="flex items-center gap-1.5 text-[13px] text-foreground">
								{project.status === "private" ? (
									<>
										<Lock className="size-3 text-muted-foreground" />
										<LanguageReveal inline>
											{t("projects.privateBadge")}
										</LanguageReveal>
									</>
								) : (
									<>
										<span className="size-1.5 rounded-full bg-foreground/60" />
										<LanguageReveal inline>
											{t("projects.publicBadge")}
										</LanguageReveal>
									</>
								)}
							</span>
						</div>

						{(project.demo || project.repo) && (
							<div className="flex flex-col gap-1.5">
								<SidebarLabel>
									<LanguageReveal inline>{t("projects.links")}</LanguageReveal>
								</SidebarLabel>
								<div className="flex flex-col gap-1.5">
									{project.demo && (
										<a
											href={project.demo}
											target="_blank"
											rel="noopener noreferrer"
											className="group flex items-center gap-1.5 text-[13px] font-medium text-foreground transition-colors hover:text-muted-foreground"
										>
											<SquareArrowOutUpRight className="size-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
											<LanguageReveal inline>
												{t("projects.viewLive")}
											</LanguageReveal>
										</a>
									)}
									{project.repo && (
										<a
											href={project.repo}
											target="_blank"
											rel="noopener noreferrer"
											className="group flex items-center gap-1.5 text-[13px] font-medium text-foreground transition-colors hover:text-muted-foreground"
										>
											<ExternalLink className="size-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
											<LanguageReveal inline>
												{t("projects.viewRepo")}
											</LanguageReveal>
										</a>
									)}
								</div>
							</div>
						)}

						<div className="flex flex-col gap-1.5">
							<SidebarLabel>
								<LanguageReveal inline>{t("stack.title")}</LanguageReveal>
							</SidebarLabel>
							<div className="flex flex-wrap gap-1.5">
								{project.stack.map((tech) => (
									<span
										key={tech}
										className="rounded-md border border-border bg-muted px-2 py-0.5 font-mono text-[11px] font-medium text-foreground/70 transition-colors duration-150 hover:border-muted-foreground/40 hover:text-foreground"
									>
										{tech}
									</span>
								))}
							</div>
						</div>

						{project.references && project.references.length > 0 && (
							<div className="flex flex-col gap-1.5">
								<SidebarLabel>
									<LanguageReveal inline>
										{t("projects.references")}
									</LanguageReveal>
								</SidebarLabel>
								<div className="flex flex-col gap-1.5">
									{project.references.map((ref) => (
										<a
											key={ref.url}
											href={ref.url}
											target="_blank"
											rel="noopener noreferrer"
											className="group flex items-center gap-1.5 text-[13px] font-medium text-foreground transition-colors hover:text-muted-foreground"
										>
											<ExternalLink className="size-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
											{ref.label}
										</a>
									))}
								</div>
							</div>
						)}

						{showNoLinkNote && (
							<div className="flex items-start gap-2 rounded-r-md border-l-2 border-foreground/25 bg-muted/50 py-2.5 pl-3 pr-3 text-[11px] leading-relaxed text-muted-foreground">
								<Lock className="mt-0.5 size-3 shrink-0" />
								<LanguageReveal inline>
									{t("projects.noPublicLink")}
								</LanguageReveal>
							</div>
						)}
					</SectionReveal>

					<SectionReveal delay={0.1} className="flex flex-col gap-8">
						{project.cover && (
							<button
								type="button"
								onClick={() =>
									project.cover &&
									openLightbox({ src: project.cover, alt: project.coverAlt })
								}
								className={`group block w-full cursor-zoom-in overflow-hidden rounded-xl border border-border shadow-sm ${project.wideMedia ? "max-w-2xl" : "max-w-sm"}`}
							>
								<FadeInImage
									src={project.cover}
									alt={project.coverAlt ?? project.title}
									containerClassName={project.wideMedia ? "" : "aspect-video"}
									imgClassName={
										project.wideMedia
											? "w-full h-auto group-hover:scale-[1.02]"
											: "h-full w-full object-cover object-top group-hover:scale-105"
									}
								/>
							</button>
						)}

						<div
							className="project-case-study prose prose-neutral dark:prose-invert max-w-none
							prose-headings:text-foreground prose-headings:tracking-tight prose-headings:font-semibold
							prose-h2:text-lg prose-h2:mt-0
							prose-p:text-foreground/80 prose-p:text-sm prose-p:leading-relaxed
							prose-li:text-foreground/80 prose-li:text-sm
							prose-strong:text-foreground
							prose-a:text-foreground
							prose-img:my-0
							prose-code:rounded-md prose-code:border prose-code:border-border prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[13px] prose-code:font-medium prose-code:font-mono prose-code:text-foreground/70 prose-code:before:content-none prose-code:after:content-none"
						>
							<MDXContent code={project.content} components={mdxComponents} />
						</div>
					</SectionReveal>
				</div>

				<Footer />
			</main>
		</div>
	);
}
