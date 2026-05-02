import { Briefcase, ChevronDown, Code2, ExternalLink } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { IconContainer } from "@/components/ui/icon-container";
import { LanguageReveal } from "@/components/ui/language-reveal";
import {
	SectionReveal,
	Stagger,
	StaggerItem,
} from "@/components/ui/section-reveal";
import { useTouchHaptics } from "@/lib/use-touch-haptics";

type Role = {
	title: string;
	period: string;
	description: string;
	current?: boolean;
};

type ExperienceItemTranslation = {
	company: string;
	roles: Role[];
};

// Map original companies to their data (urls, techs, etc.)
const staticExperienceData: Record<
	string,
	{ url: string; techs: string[]; typeKey: string }
> = {
	"2M/MPE": {
		url: "https://mpe.com.br/quem-somos/",
		typeKey: "experience.types.clt",
		techs: [".NET", "React", "TypeScript", "IoT", "PostgreSQL", "Docker"],
	},
	"Self-employed": {
		url: "https://kadukessler.com",
		typeKey: "experience.types.freelance",
		techs: ["WordPress", "Elementor", "Figma", "SEO", "DNS"],
	},
	"Eloo Perícias": {
		url: "https://eloopericias.com.br",
		typeKey: "experience.types.contract",
		techs: ["Python", "Django", "Automation", "VBA", "Web Scraping"],
	},
	Autônomo: {
		url: "https://kadukessler.com",
		typeKey: "experience.types.freelance",
		techs: ["WordPress", "Elementor", "Figma", "SEO", "DNS"],
	},
};

function TechPill({ name }: { name: string }) {
	return (
		<span className="rounded-md border border-border bg-background px-2 py-0.5 font-mono text-xs text-muted-foreground transition-colors duration-150 hover:border-muted-foreground/30 hover:bg-muted/50 hover:text-foreground">
			{name}
		</span>
	);
}

function ExperienceRoleCard({
	role,
	idx,
	rolesLength,
	shouldReduceMotion,
	i18nPath,
}: {
	role: Role;
	idx: number;
	rolesLength: number;
	shouldReduceMotion: boolean;
	i18nPath: string;
}) {
	const { t } = useTranslation();
	const { triggerTap } = useTouchHaptics();
	const [isOpen, setIsOpen] = useState(Boolean(role.current));
	const panelId = useId();

	const handleToggle = () => {
		triggerTap?.();
		setIsOpen((open) => !open);
	};

	return (
		<div
			className={`relative grid ${rolesLength > 1 ? "grid-cols-[12px_1fr] gap-2 sm:grid-cols-[16px_1fr] sm:gap-3" : "grid-cols-[0px_1fr] gap-0"} ${idx < rolesLength - 1 ? "pb-3" : ""}`}
		>
			<div className="flex justify-center">
				{rolesLength > 1 && idx > 0 && (
					<div className="absolute left-[5.5px] top-0 h-5 w-px bg-border sm:left-[7.5px]" />
				)}
				{rolesLength > 1 && idx < rolesLength - 1 && (
					<div className="absolute bottom-0 left-[5.5px] top-5 w-px bg-border sm:left-[7.5px]" />
				)}
				{rolesLength > 1 && (
					<div className="relative z-10 mt-5 size-2 rounded-full border border-border bg-muted" />
				)}
			</div>
			<div className="group/role relative rounded-lg border border-border/50 bg-background/30 px-3 py-2.5 transition-colors duration-150 hover:border-muted-foreground/35">
				<button
					type="button"
					onClick={handleToggle}
					aria-expanded={isOpen}
					aria-controls={panelId}
					className="absolute inset-0 z-0 cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
				>
					<span className="sr-only">
						{t("experience.toggleDetails", { role: role.title })}
					</span>
				</button>

				<div className="relative z-10 pointer-events-none flex min-h-8 flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-2">
					<div className="min-w-0 flex-1">
						<div className="flex items-center gap-1.5">
							<Code2 className="size-3.5 shrink-0 text-muted-foreground/80" />
							<p className="text-left text-sm font-semibold text-foreground">
								<LanguageReveal inline>{role.title}</LanguageReveal>
							</p>
						</div>
					</div>
					<div className="flex w-full flex-wrap items-center gap-1.5 sm:w-auto sm:shrink-0 sm:gap-2 sm:pl-2">
						{role.current && (
							<motion.span
								className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-400"
								animate={
									shouldReduceMotion ? undefined : { opacity: [0.45, 1, 0.45] }
								}
								transition={{
									duration: 1.6,
									ease: "easeInOut",
									repeat: Number.POSITIVE_INFINITY,
								}}
							>
								<LanguageReveal inline>
									{t("experience.current")}
								</LanguageReveal>
							</motion.span>
						)}
						<span className="whitespace-nowrap rounded-md border border-border/70 bg-background/70 px-2 py-1 font-mono text-[10px] text-muted-foreground/80 sm:text-[11px]">
							<LanguageReveal inline>{role.period}</LanguageReveal>
						</span>
						<span className="inline-flex items-center text-muted-foreground transition-colors group-hover/role:text-foreground">
							<ChevronDown
								aria-hidden="true"
								className={`size-4 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
							/>
						</span>
					</div>
				</div>
				<motion.div
					id={panelId}
					initial={false}
					animate={{
						height: isOpen ? "auto" : 0,
						opacity: isOpen ? 1 : 0,
						marginTop: isOpen ? 8 : 0,
					}}
					transition={{ duration: 0.28, ease: "easeOut" }}
					className="relative z-10 overflow-hidden"
				>
					<div className="pointer-events-auto text-sm leading-relaxed text-muted-foreground">
						<LanguageReveal>
							<Trans i18nKey={`${i18nPath}.description`}>
								{role.description}
								<a
									href="https://alertai.com.br"
									target="_blank"
									rel="noopener noreferrer"
									className="font-medium text-foreground underline decoration-border decoration-1 underline-offset-4 transition-colors hover:decoration-foreground"
								>
									AlertAI
								</a>
							</Trans>
						</LanguageReveal>
					</div>
				</motion.div>
			</div>
		</div>
	);
}

export function Experience() {
	const { t } = useTranslation();
	const shouldReduceMotion = useReducedMotion();

	const experienceItems = t("experience.items", {
		returnObjects: true,
	}) as ExperienceItemTranslation[];

	return (
		<SectionReveal delay={0.1}>
			<section className="flex flex-col gap-5">
				<h2 className="text-lg font-medium">
					<LanguageReveal inline>{t("experience.title")}</LanguageReveal>
				</h2>

				<div className="flex flex-col gap-4">
					{experienceItems.map((item, itemIdx) => {
						const staticData = staticExperienceData[
							item.company as keyof typeof staticExperienceData
						] || {
							url: "#",
							techs: [],
							typeKey: "experience.types.clt",
						};

						return (
							<div
								key={item.company}
								className="card-elevated group relative rounded-xl border border-border bg-card p-4 transition-colors duration-200 hover:border-muted-foreground/40 sm:p-5"
							>
								<div className="flex flex-col gap-5">
									<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
										<div className="flex items-start gap-3">
											<IconContainer>
												<Briefcase className="size-4 text-muted-foreground" />
											</IconContainer>
											<div className="flex flex-col gap-1">
												<div className="flex items-center gap-2">
													<a
														href={staticData.url}
														target="_blank"
														rel="noopener noreferrer"
														className="inline-flex items-center gap-1 font-medium text-foreground transition-colors hover:text-foreground/80"
													>
														{item.company}
														<ExternalLink className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
													</a>
												</div>
												<div className="flex items-center gap-2 text-[11px] text-muted-foreground/70">
													<LanguageReveal inline>
														{t(staticData.typeKey)}
													</LanguageReveal>
												</div>
											</div>
										</div>
									</div>

									<div className="flex flex-col gap-0">
										{item.roles.map((role, roleIdx) => (
											<ExperienceRoleCard
												key={`${item.company}-${role.title}-${role.period}`}
												role={role}
												idx={roleIdx}
												rolesLength={item.roles.length}
												shouldReduceMotion={Boolean(shouldReduceMotion)}
												i18nPath={`experience.items.${itemIdx}.roles.${roleIdx}`}
											/>
										))}
									</div>

									<Stagger className="flex flex-wrap gap-1.5" delay={0.05}>
										{staticData.techs.map((tech) => (
											<StaggerItem key={tech}>
												<TechPill name={tech} />
											</StaggerItem>
										))}
									</Stagger>
								</div>
							</div>
						);
					})}
				</div>
			</section>
		</SectionReveal>
	);
}
