import {
	ArrowRight,
	ExternalLink,
	FolderGit2,
	Lock,
	SquareArrowOutUpRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FadeInImage } from "@/components/ui/fade-in-image";
import { LanguageReveal } from "@/components/ui/language-reveal";
import { Stagger, StaggerItem } from "@/components/ui/section-reveal";
import type { ProjectMeta } from "@/lib/projects";
import { cn } from "@/lib/utils";

export function formatPeriod(project: ProjectMeta, present: string) {
	return `${project.periodStart} — ${project.periodEnd ?? present}`;
}

export function TechPill({ name }: { name: string }) {
	return (
		<span className="rounded-md border border-border bg-muted px-2 py-0.5 font-mono text-xs font-medium text-foreground/70 transition-colors duration-150 group-hover:border-muted-foreground/40 group-hover:text-foreground">
			{name}
		</span>
	);
}

function ExternalLinkBadge({
	href,
	icon: Icon,
	label,
}: {
	href: string;
	icon: typeof SquareArrowOutUpRight;
	label: string;
}) {
	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className="relative z-20 inline-flex items-center gap-1 rounded text-[11px] text-muted-foreground/70 transition-colors hover:text-foreground hover:underline"
		>
			<Icon className="size-3" />
			<LanguageReveal inline>{label}</LanguageReveal>
		</a>
	);
}

function ProjectThumbnail({
	project,
	aspectClassName,
	logoPadding = "p-8",
}: {
	project: ProjectMeta;
	aspectClassName: string;
	logoPadding?: string;
}) {
	const { t } = useTranslation();

	return (
		<div
			className={cn(
				"isolate w-full overflow-hidden bg-muted",
				aspectClassName,
			)}
		>
			{project.cover ? (
				<FadeInImage
					src={project.cover}
					alt={project.coverAlt ?? project.title}
					containerClassName="h-full"
					imgClassName="h-full w-full object-cover object-top group-hover:scale-105"
				/>
			) : project.logo ? (
				<div
					className={cn(
						"flex h-full w-full items-center justify-center",
						logoPadding,
					)}
				>
					<FadeInImage
						src={project.logo}
						alt={project.logoAlt ?? project.title}
						containerClassName="min-h-[60px]"
						imgClassName="max-h-full w-auto object-contain group-hover:scale-105"
					/>
				</div>
			) : (
				<div className="flex h-full w-full flex-col items-center justify-center gap-2">
					{project.status === "private" ? (
						<>
							<Lock className="size-6 text-muted-foreground/40" />
							<span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground/40">
								<LanguageReveal inline>
									{t("projects.privateBadge")}
								</LanguageReveal>
							</span>
						</>
					) : (
						<FolderGit2 className="size-8 text-muted-foreground/30" />
					)}
				</div>
			)}
		</div>
	);
}

export function FeaturedCard({ project }: { project: ProjectMeta }) {
	const { t } = useTranslation();

	return (
		<div className="card-elevated group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card hover:-translate-y-0.5 hover:border-muted-foreground/40">
			<Link
				to={`/projects/${project.slug}`}
				className="absolute inset-0 z-10 rounded-xl"
				aria-label={`${project.title}: ${t("projects.viewDetails")}`}
			/>

			<ProjectThumbnail project={project} aspectClassName="aspect-video" />

			<div className="flex flex-col gap-4 p-4 sm:p-5">
				<div className="flex items-start justify-between gap-3">
					<div className="flex flex-col gap-1">
						<span className="font-medium text-foreground">{project.title}</span>
						<span className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground/70">
							<span className="uppercase tracking-wide">{project.type}</span>
							<span className="text-muted-foreground/30">·</span>
							{formatPeriod(project, t("projects.present"))}
						</span>
					</div>
					{project.status === "private" && (
						<span className="flex items-center gap-1 whitespace-nowrap rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
							<Lock className="size-2.5" />
							<LanguageReveal inline>{t("projects.privateBadge")}</LanguageReveal>
						</span>
					)}
				</div>

				<p className="text-sm leading-relaxed text-foreground/80">
					{project.summary}
				</p>

				<Stagger className="flex flex-wrap gap-1.5" delay={0.04}>
					{project.stack.map((tech) => (
						<StaggerItem key={tech}>
							<TechPill name={tech} />
						</StaggerItem>
					))}
				</Stagger>

				<div className="mt-1 flex items-center justify-between">
					<span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
						<LanguageReveal inline>{t("projects.viewDetails")}</LanguageReveal>
						<ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
					</span>
					{project.demo && (
						<ExternalLinkBadge
							href={project.demo}
							icon={SquareArrowOutUpRight}
							label={t("projects.viewLive")}
						/>
					)}
					{!project.demo && project.repo && (
						<ExternalLinkBadge
							href={project.repo}
							icon={ExternalLink}
							label={t("projects.viewRepo")}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

export function CompactCard({ project }: { project: ProjectMeta }) {
	const { t } = useTranslation();

	return (
		<Link
			to={`/projects/${project.slug}`}
			className="card-elevated group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card hover:-translate-y-0.5 hover:border-muted-foreground/40"
		>
			<ProjectThumbnail
				project={project}
				aspectClassName="aspect-video"
				logoPadding="p-6"
			/>

			<div className="flex flex-1 flex-col gap-2 p-4">
				<div className="flex items-start justify-between gap-2">
					<div className="flex flex-col gap-0.5">
						<span className="text-[13.5px] font-semibold text-foreground">
							{project.title}
						</span>
						<span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground/60">
							{project.type}
						</span>
					</div>
					<div className="flex shrink-0 items-center gap-1.5">
						{project.status === "private" && (
							<Lock className="size-3 text-muted-foreground" />
						)}
						<ArrowRight
							aria-hidden
							className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
						/>
					</div>
				</div>
				<p className="line-clamp-2 text-xs leading-relaxed text-foreground/80">
					{project.summary}
				</p>
				<div className="mt-auto flex flex-wrap gap-1.5 pt-1">
					{project.stack.slice(0, 3).map((tech) => (
						<TechPill key={tech} name={tech} />
					))}
				</div>
				<span className="sr-only">
					<LanguageReveal inline>{t("projects.viewDetails")}</LanguageReveal>
				</span>
			</div>
		</Link>
	);
}

export function GalleryCard({ project }: { project: ProjectMeta }) {
	const { t } = useTranslation();

	return (
		<div className="card-elevated group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card hover:-translate-y-0.5 hover:border-muted-foreground/40">
			<Link
				to={`/projects/${project.slug}`}
				className="absolute inset-0 z-10 rounded-xl"
				aria-label={`${project.title}: ${t("projects.viewDetails")}`}
			/>

			<ProjectThumbnail project={project} aspectClassName="aspect-video" />

			<div className="flex flex-1 flex-col gap-2.5 p-4">
				<div className="flex items-start justify-between gap-2">
					<div className="flex flex-col gap-0.5">
						<span className="font-medium text-foreground">{project.title}</span>
						<span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide text-muted-foreground/60">
							{project.type}
							<span className="text-muted-foreground/30">·</span>
							<span className="normal-case tracking-normal">
								{formatPeriod(project, t("projects.present"))}
							</span>
						</span>
					</div>
					{project.status === "private" && (
						<Lock className="mt-0.5 size-3 shrink-0 text-muted-foreground" />
					)}
				</div>

				<p className="line-clamp-2 text-xs leading-relaxed text-foreground/80">
					{project.summary}
				</p>

				<div className="flex flex-wrap gap-1.5">
					{project.stack.slice(0, 4).map((tech) => (
						<TechPill key={tech} name={tech} />
					))}
				</div>

				<div className="mt-auto flex items-center justify-between pt-1">
					<span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors group-hover:text-foreground">
						<LanguageReveal inline>{t("projects.viewDetails")}</LanguageReveal>
						<ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
					</span>
					{project.demo && (
						<ExternalLinkBadge
							href={project.demo}
							icon={SquareArrowOutUpRight}
							label={t("projects.viewLive")}
						/>
					)}
					{!project.demo && project.repo && (
						<ExternalLinkBadge
							href={project.repo}
							icon={ExternalLink}
							label={t("projects.viewRepo")}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
