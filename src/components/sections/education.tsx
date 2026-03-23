import { ChevronDown, ExternalLink, GraduationCap } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { SectionReveal } from "@/components/ui/section-reveal";

type EducationItem = {
	institution: string;
	url: string;
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
	const [isOpen, setIsOpen] = useState(Boolean(edu.current));

	return (
		<div className="group rounded-xl border border-border bg-card/50 p-5 transition-colors duration-200 hover:border-muted-foreground/20">
			<div className="flex items-start justify-between gap-3">
				<div className="flex min-w-0 items-start gap-3">
					<div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50">
						<GraduationCap className="size-4 text-muted-foreground" />
					</div>
					<div className="flex min-w-0 flex-col gap-1">
						<a
							href={edu.url}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex w-fit items-center gap-1 font-medium text-foreground transition-colors hover:text-foreground/80"
						>
							{edu.institution}
							<ExternalLink className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
						</a>
						<p className="text-sm text-muted-foreground">{edu.course}</p>
						<p className="text-xs text-muted-foreground/60">{edu.fullName}</p>
					</div>
				</div>

				<div className="flex shrink-0 items-center gap-2 pl-2">
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
					<span className="whitespace-nowrap rounded-md border border-border/70 bg-background/40 px-2 py-1 font-mono text-[11px] text-muted-foreground/80">
						{edu.period}
					</span>
					<button
						type="button"
						onClick={() => setIsOpen((open) => !open)}
						aria-expanded={isOpen}
						className="inline-flex items-center text-muted-foreground transition-colors hover:text-foreground"
					>
						<span className="sr-only">Toggle education details</span>
						<ChevronDown
							className={`size-4 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
						/>
					</button>
				</div>
			</div>

			<motion.div
				initial={false}
				animate={{
					height: isOpen ? "auto" : 0,
					opacity: isOpen ? 1 : 0,
					marginTop: isOpen ? 12 : 0,
				}}
				transition={{ duration: 0.28, ease: "easeOut" }}
				className="overflow-hidden"
			>
				<p className="pl-13 text-sm leading-relaxed text-muted-foreground">
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
