import { ArrowLeft, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { GalleryCard } from "@/components/sections/project-cards";
import { Background } from "@/components/ui/background";
import { LanguageReveal } from "@/components/ui/language-reveal";
import { LanguageToggle } from "@/components/ui/language-toggle";
import {
	SectionReveal,
	Stagger,
	StaggerItem,
} from "@/components/ui/section-reveal";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getAllProjects } from "@/lib/projects";

export function ProjectsPage() {
	const { t, i18n } = useTranslation();
	const lang = i18n.language.startsWith("pt") ? "pt" : "en";
	const allProjects = useMemo(() => getAllProjects(lang), [lang]);

	const [query, setQuery] = useState("");
	const [selectedType, setSelectedType] = useState<string | null>(null);

	const types = useMemo(
		() => Array.from(new Set(allProjects.map((p) => p.type))),
		[allProjects],
	);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		return allProjects.filter((p) => {
			const matchesType = !selectedType || p.type === selectedType;
			const matchesQuery =
				!q ||
				p.title.toLowerCase().includes(q) ||
				p.summary.toLowerCase().includes(q) ||
				p.stack.some((tech) => tech.toLowerCase().includes(q));
			return matchesType && matchesQuery;
		});
	}, [allProjects, query, selectedType]);

	const showFilters = allProjects.length > 5;

	return (
		<div className="min-h-screen bg-background">
			<Background />
			<main className="relative mx-auto flex max-w-5xl flex-col gap-8 px-4 pt-10 pb-16 sm:px-6 sm:pt-14 sm:pb-24">
				<SectionReveal>
					<nav className="flex items-center justify-between">
						<Link
							to="/#projects"
							className="group flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
						>
							<ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
							<LanguageReveal inline>{t("common.backHome")}</LanguageReveal>
						</Link>
						<div className="flex items-center gap-1">
							<LanguageToggle />
							<ThemeToggle />
						</div>
					</nav>
				</SectionReveal>

				<SectionReveal delay={0.05}>
					<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
						<LanguageReveal inline>{t("projects.title")}</LanguageReveal>
					</h1>
				</SectionReveal>

				{showFilters && (
					<SectionReveal delay={0.08}>
						<div className="flex flex-col gap-3">
							<div className="relative">
								<Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground/50" />
								<input
									type="text"
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									placeholder={t("projects.searchPlaceholder")}
									className="w-full rounded-lg border border-border bg-card py-2 pr-9 pl-9 text-sm text-foreground transition-colors placeholder:text-muted-foreground/50 focus:border-muted-foreground/40 focus:outline-none"
								/>
								{query && (
									<button
										type="button"
										onClick={() => setQuery("")}
										className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground"
										aria-label="Clear search"
									>
										<X className="size-3.5" />
									</button>
								)}
							</div>

							<div className="flex flex-wrap gap-2">
								<button
									type="button"
									onClick={() => setSelectedType(null)}
									className={`rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wide transition-colors ${
										selectedType === null
											? "border-foreground/30 bg-muted text-foreground"
											: "border-border text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"
									}`}
								>
									{t("projects.allTypes")}
								</button>
								{types.map((type) => (
									<button
										type="button"
										key={type}
										onClick={() => setSelectedType(type)}
										className={`rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wide transition-colors ${
											selectedType === type
												? "border-foreground/30 bg-muted text-foreground"
												: "border-border text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"
										}`}
									>
										{type}
									</button>
								))}
							</div>
						</div>
					</SectionReveal>
				)}

				{filtered.length > 0 ? (
					<Stagger
						key={`${selectedType ?? "all"}-${query}`}
						className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
						delay={0.05}
						stagger={0.05}
					>
						{filtered.map((project) => (
							<StaggerItem key={project.slug}>
								<GalleryCard project={project} />
							</StaggerItem>
						))}
					</Stagger>
				) : (
					<SectionReveal delay={0.1}>
						<p className="text-sm text-muted-foreground">
							{allProjects.length === 0 ? (
								<LanguageReveal inline>{t("projects.empty")}</LanguageReveal>
							) : (
								<LanguageReveal inline>{t("common.noResults")}</LanguageReveal>
							)}
						</p>
					</SectionReveal>
				)}
			</main>
		</div>
	);
}
