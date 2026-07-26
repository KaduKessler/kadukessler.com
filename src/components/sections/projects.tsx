import { ArrowRight } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { CompactCard, FeaturedCard } from "@/components/sections/project-cards";
import { LanguageReveal } from "@/components/ui/language-reveal";
import {
	SectionReveal,
	Stagger,
	StaggerItem,
} from "@/components/ui/section-reveal";
import { getAllProjects } from "@/lib/projects";

const HOME_LIMIT = 5;

export function Projects() {
	const { t, i18n } = useTranslation();
	const lang = i18n.language.startsWith("pt") ? "pt" : "en";
	const allProjects = useMemo(() => getAllProjects(lang), [lang]);

	if (allProjects.length === 0) return null;

	const visible = allProjects.slice(0, HOME_LIMIT);
	const [featured, ...rest] = visible;
	const hasMore = allProjects.length > HOME_LIMIT;

	return (
		<SectionReveal delay={0.15}>
			<section className="flex flex-col gap-5">
				<div className="flex items-center justify-between gap-3">
					<h2 className="text-xl font-semibold tracking-tight">
						<LanguageReveal inline>{t("projects.title")}</LanguageReveal>
					</h2>
					{hasMore && (
						<Link
							to="/projects"
							className="group flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
						>
							<LanguageReveal inline>{t("projects.viewAll")}</LanguageReveal>
							<ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
						</Link>
					)}
				</div>

				<Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2" delay={0.05}>
					<StaggerItem className="sm:col-span-2">
						<FeaturedCard project={featured} />
					</StaggerItem>
					{rest.map((project) => (
						<StaggerItem key={project.slug}>
							<CompactCard project={project} />
						</StaggerItem>
					))}
				</Stagger>
			</section>
		</SectionReveal>
	);
}
