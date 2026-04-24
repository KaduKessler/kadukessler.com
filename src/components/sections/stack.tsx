import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
	SiDjango,
	SiDocker,
	SiDotnet,
	SiGit,
	SiLinux,
	SiNextdotjs,
	SiNodedotjs,
	SiPostgresql,
	SiPython,
	SiReact,
	SiTailwindcss,
	SiTypescript,
} from "react-icons/si";
import { TbBrandCSharp, TbSql } from "react-icons/tb";
import { LanguageReveal } from "@/components/ui/language-reveal";
import {
	SectionReveal,
	Stagger,
	StaggerItem,
} from "@/components/ui/section-reveal";

const stackCategories = [
	{
		key: "languages",
		items: [
			{ name: "C#", icon: TbBrandCSharp },
			{ name: "TypeScript", icon: SiTypescript },
			{ name: "Python", icon: SiPython },
			{ name: "SQL", icon: TbSql },
			{ name: "Node.js", icon: SiNodedotjs },
		],
	},
	{
		key: "frameworks",
		items: [
			{ name: "ASP.NET Core", icon: SiDotnet },
			{ name: "React", icon: SiReact },
			{ name: "Next.js", icon: SiNextdotjs },
			{ name: "Django", icon: SiDjango },
			{ name: "Tailwind CSS", icon: SiTailwindcss },
		],
	},
	{
		key: "infrastructure",
		items: [
			{ name: "PostgreSQL", icon: SiPostgresql },
			{ name: "Docker", icon: SiDocker },
			{ name: "Linux", icon: SiLinux },
			{ name: "Git", icon: SiGit },
			{ name: "REST APIs", icon: Globe },
		],
	},
];

export function Stack() {
	const { t } = useTranslation();

	return (
		<SectionReveal delay={0.2}>
			<section className="flex flex-col gap-6 py-2">
				<h2 className="text-lg font-medium tracking-tight text-foreground">
					<LanguageReveal inline>{t("stack.title")}</LanguageReveal>
				</h2>

				<Stagger className="flex flex-col gap-8" delay={0.08}>
					{stackCategories.map((category) => (
						<StaggerItem key={category.key} className="flex flex-col gap-3">
							<span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30">
								<LanguageReveal inline>
									{t(`stack.categories.${category.key}`)}
								</LanguageReveal>
							</span>

							<div className="flex flex-wrap gap-2">
								{category.items.map((tech) => (
									<div
										key={tech.name}
										className="group flex items-center gap-2 rounded-lg border border-border/40 bg-card/30 p-1 pr-2.5 transition-all duration-200 hover:border-border hover:bg-muted/50"
									>
										<div className="flex size-7 shrink-0 items-center justify-center rounded-md border border-border/60 bg-background/50 transition-colors group-hover:bg-background">
											<tech.icon className="size-3.5 opacity-50 transition-opacity group-hover:opacity-100" />
										</div>
										<span className="whitespace-nowrap text-[13px] font-medium text-muted-foreground/80 transition-colors group-hover:text-foreground">
											{tech.name}
										</span>
									</div>
								))}
							</div>
						</StaggerItem>
					))}
				</Stagger>
			</section>
		</SectionReveal>
	);
}
