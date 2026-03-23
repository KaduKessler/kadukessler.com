import { ChevronDown, ExternalLink, GraduationCap } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
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

const education: EducationItem[] = [
	{
		institution: "PUCRS",
		url: "https://www.pucrs.br",
		logo: "/images/edu_pucrs.svg",
		fullName: "Pontifical Catholic University of Rio Grande do Sul",
		course: "Analysis and Systems Development",
		description:
			"Full-stack curriculum centered on end-to-end delivery: React/Vite/MUI on the front-end, Node.js/TypeScript REST APIs with Docker and Prisma/SQL on the back-end, and microservices architecture with API Gateway, RabbitMQ, and cache strategies. Also covered secure engineering with cryptography fundamentals, STRIDE threat modeling, and LGPD-oriented practices.",
		period: "02.2024 — 2026",
		current: true,
	},
	{
		institution: "UFSM",
		url: "https://www.ufsm.br",
		logo: "/images/edu_ufsm.svg",
		fullName: "Federal University of Santa Maria",
		course: "Technical Degree in Informatics",
		description:
			"Built a strong technical foundation in relational modeling and SQL with PostgreSQL, plus practical web development using HTML/CSS, Bulma/Sass, and Django/Python integrations. Delivered a Java prototype for credit recovery workflows, studied networking fundamentals, and completed a capstone focused on designing and implementing a REST API with Django REST Framework.",
		period: "05.2021 — 12.2023",
		current: false,
	},
];

function EducationCard({
	edu,
	shouldReduceMotion,
}: {
	edu: EducationItem;
	shouldReduceMotion: boolean;
}) {
	const { triggerTap } = useTouchHaptics();
	const [isOpen, setIsOpen] = useState(Boolean(edu.current));
	const panelId = useId();

	const handleToggle = () => {
		triggerTap?.();
		setIsOpen((open) => !open);
	};

	return (
		<div className="group rounded-xl border border-border bg-card/50 p-4 transition-colors duration-200 hover:border-muted-foreground/20 sm:p-5">
			<div className="relative">
				<button
					type="button"
					onClick={handleToggle}
					aria-expanded={isOpen}
					aria-controls={panelId}
					className="absolute inset-0 z-0 cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
				>
					<span className="sr-only">Toggle details for {edu.institution}</span>
				</button>

				<div className="relative z-10 pointer-events-none flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
						<div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50">
							{edu.logo ? (
								<img
									src={edu.logo}
									alt={`${edu.institution} logo`}
									className="h-6 w-6 object-contain"
								/>
							) : (
								<GraduationCap className="size-4 text-muted-foreground" />
							)}
						</div>
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
							<p className="text-sm text-muted-foreground">{edu.course}</p>
							<p className="text-xs text-muted-foreground/60">{edu.fullName}</p>
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
								In progress
							</motion.span>
						)}
						<span className="whitespace-nowrap rounded-md border border-border/70 bg-background/40 px-2 py-1 font-mono text-[10px] text-muted-foreground/80 sm:text-[11px]">
							{edu.period}
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
				<p className="select-text pl-12.5 text-sm leading-relaxed text-muted-foreground sm:pl-13">
					{edu.description}
				</p>
			</motion.div>
		</div>
	);
}

export function Education() {
	const shouldReduceMotion = useReducedMotion();

	return (
		<SectionReveal delay={0.15}>
			<section className="flex flex-col gap-5">
				<h2 className="text-lg font-medium">Education</h2>

				<div className="flex flex-col gap-4">
					{education.map((edu) => (
						<EducationCard
							key={edu.institution}
							edu={edu}
							shouldReduceMotion={Boolean(shouldReduceMotion)}
						/>
					))}
				</div>
			</section>
		</SectionReveal>
	);
}
