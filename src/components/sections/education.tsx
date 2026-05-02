import { ChevronDown, ExternalLink, GraduationCap } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { IconContainer } from "@/components/ui/icon-container";
import { LanguageReveal } from "@/components/ui/language-reveal";
import { SectionReveal } from "@/components/ui/section-reveal";
import { useTouchHaptics } from "@/lib/use-touch-haptics";

type EducationItem = {
	institution: string;
	url: string;
	logo?: string;
	fullName: string;
	course: string;
	description: string;
	period: string;
	current: boolean;
};

type EducationTranslation = {
	institution: string;
	fullName: string;
	course: string;
	description: string;
	period: string;
	current: boolean;
};

const staticEducationData: Record<string, { url: string; logo?: string }> = {
	PUCRS: {
		url: "https://www.pucrs.br",
		logo: "/images/edu_pucrs.svg",
	},
	UFSM: {
		url: "https://www.ufsm.br",
		logo: "/images/edu_ufsm.svg",
	},
};

function EducationCard({
	edu,
	shouldReduceMotion,
}: {
	edu: EducationItem;
	shouldReduceMotion: boolean;
}) {
	const { t } = useTranslation();
	const { triggerTap } = useTouchHaptics();
	const [isOpen, setIsOpen] = useState(Boolean(edu.current));
	const panelId = useId();

	const handleToggle = () => {
		triggerTap?.();
		setIsOpen((open) => !open);
	};

	return (
		<div className="card-elevated group rounded-xl border border-border bg-card p-4 transition-colors duration-200 hover:border-muted-foreground/40 sm:p-5">
			<div className="relative">
				<button
					type="button"
					onClick={handleToggle}
					aria-expanded={isOpen}
					aria-controls={panelId}
					className="absolute inset-0 z-0 cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
				>
					<span className="sr-only">
						{t("education.toggleDetails", { institution: edu.institution })}
					</span>
				</button>

				<div className="relative z-10 pointer-events-none flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
						<IconContainer>
							{edu.logo ? (
								<img
									src={edu.logo}
									alt={`${edu.institution} logo`}
									className="h-6 w-6 object-contain"
								/>
							) : (
								<GraduationCap className="size-4 text-muted-foreground" />
							)}
						</IconContainer>
						<div className="flex min-w-0 flex-col gap-1">
							<a
								href={edu.url}
								target="_blank"
								rel="noopener noreferrer"
								className="pointer-events-auto inline-flex w-fit items-center gap-1 font-medium text-foreground transition-colors hover:text-foreground/80"
							>
								{edu.institution}
								<ExternalLink className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
							</a>
							<LanguageReveal className="text-sm text-muted-foreground">
								{edu.course}
							</LanguageReveal>
							<LanguageReveal className="text-xs text-muted-foreground/60">
								{edu.fullName}
							</LanguageReveal>
						</div>
					</div>

					<div className="flex w-full flex-wrap items-center gap-1.5 sm:w-auto sm:shrink-0 sm:gap-2 sm:pl-2">
						{edu.current && (
							<motion.span
								className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-blue-400"
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
									{t("education.inProgress")}
								</LanguageReveal>
							</motion.span>
						)}
						<span className="whitespace-nowrap rounded-md border border-border/70 bg-background/70 px-2 py-1 font-mono text-[10px] text-muted-foreground/80 sm:text-[11px]">
							<LanguageReveal inline>{edu.period}</LanguageReveal>
						</span>
						<span className="inline-flex items-center text-muted-foreground transition-colors group-hover:text-foreground">
							<ChevronDown
								aria-hidden="true"
								className={`size-4 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
							/>
						</span>
					</div>
				</div>
			</div>

			<motion.div
				id={panelId}
				initial={false}
				animate={{
					height: isOpen ? "auto" : 0,
					opacity: isOpen ? 1 : 0,
					marginTop: isOpen ? 12 : 0,
				}}
				transition={{ duration: 0.28, ease: "easeOut" }}
				className="overflow-hidden"
			>
				<LanguageReveal className="select-text pl-12.5 text-sm leading-relaxed text-muted-foreground sm:pl-13">
					{edu.description}
				</LanguageReveal>
			</motion.div>
		</div>
	);
}

export function Education() {
	const { t } = useTranslation();
	const shouldReduceMotion = useReducedMotion();

	const educationItems = t("education.items", {
		returnObjects: true,
	}) as EducationTranslation[];

	return (
		<SectionReveal delay={0.15}>
			<section className="flex flex-col gap-5">
				<h2 className="text-lg font-medium">
					<LanguageReveal inline>{t("education.title")}</LanguageReveal>
				</h2>

				<div className="flex flex-col gap-4">
					{educationItems.map((item) => {
						const staticData = staticEducationData[
							item.institution as keyof typeof staticEducationData
						] || { url: "#" };
						return (
							<EducationCard
								key={item.institution}
								edu={{
									...item,
									...staticData,
								}}
								shouldReduceMotion={Boolean(shouldReduceMotion)}
							/>
						);
					})}
				</div>
			</section>
		</SectionReveal>
	);
}
