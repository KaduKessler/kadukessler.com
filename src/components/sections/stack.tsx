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
				<h2 className="text-xl font-semibold tracking-tight text-foreground">
					<LanguageReveal inline>{t("stack.title")}</LanguageReveal>
				</h2>

				<Stagger className="flex flex-col gap-5" delay={0.08}>
					{stackCategories.map((category) => (
						<StaggerItem key={category.key} className="flex flex-col gap-2.5">
							<span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
								<LanguageReveal inline>
									{t(`stack.categories.${category.key}`)}
								</LanguageReveal>
							</span>

							<div className="flex flex-wrap gap-1.5">
								{category.items.map((tech) => (
									<div
										key={tech.name}
										className="group flex items-center gap-1.5 rounded-md px-2 py-1 text-[13px] font-medium text-foreground/70 transition-colors duration-150 hover:bg-muted hover:text-foreground"
									>
										<tech.icon
											aria-hidden="true"
											className="size-3.5 opacity-60 transition-opacity group-hover:opacity-100"
										/>
										<span className="whitespace-nowrap">{tech.name}</span>
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
