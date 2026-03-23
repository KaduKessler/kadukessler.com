import { useState, type MouseEvent, type ReactNode } from "react";
import { Briefcase, ChevronDown, Code2, ExternalLink } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import {
	SectionReveal,
	Stagger,
	StaggerItem,
} from "@/components/ui/section-reveal";

type Role = {
	title: string;
	period: string;
	description: ReactNode;
	current?: boolean;
};

type ExperienceItem = {
	company: string;
	url: string;
	type: string;
	roles: Role[];
	techs: string[];
};

const experiences: ExperienceItem[] = [
	{
		company: "2M/MPE",
		url: "https://mpe.com.br/quem-somos/",
		type: "CLT",
		roles: [
			{
				title: "Full-Stack Junior",
				period: "04.2026 — Present",
				current: true,
				description: (
					<>
						Working with .NET, React, and IoT integrations for the{" "}
						<a
							href="https://alertai.com.br"
							target="_blank"
							rel="noopener noreferrer"
							className="font-medium text-foreground underline decoration-border decoration-1 underline-offset-4 transition-colors hover:decoration-foreground"
						>
							AlertAI
						</a>{" "}
						security platform. Focused on scalable monitoring, real-time events,
						and high-performance infrastructure.
					</>
				),
			},
			{
				title: "Full-Stack Trainee",
				period: "12.2025 — 04.2026",
				description:
					"Started building security monitoring modules and real-time visualization tools for internal and customer-facing workflows.",
			},
		],
		techs: [".NET", "React", "TypeScript", "IoT", "PostgreSQL", "Docker"],
	},
	{
		company: "Self-employed",
		url: "https://kadukessler.com",
		type: "Freelance",
		roles: [
			{
				title: "Web Developer",
				period: "12.2024 — 12.2025",
				description:
					"Delivered institutional websites in WordPress with responsive design, hosting/domain setup, plugin customization, and SEO/performance improvements.",
			},
		],
		techs: ["WordPress", "Elementor", "Figma", "SEO", "DNS"],
	},
	{
		company: "Eloo Perícias",
		url: "https://eloopericias.com.br",
		type: "Contract (ad-hoc)",
		roles: [
			{
				title: "Software Developer",
				period: "05.2022 — 12.2024",
				description:
					"Built automation tools for data collection, report generation, and financial workflows, including web systems and VBA scripts for internal operations.",
			},
		],
		techs: ["Python", "Django", "Automation", "VBA", "Web Scraping"],
	},
];

function TechPill({ name }: { name: string }) {
	return (
		<span className="rounded-md border border-border bg-muted/50 px-2 py-0.5 font-mono text-xs text-muted-foreground transition-colors duration-150 hover:border-muted-foreground/30 hover:bg-muted/80 hover:text-foreground">
			{name}
		</span>
	);
}

function ExperienceRoleCard({
	role,
	idx,
	rolesLength,
	shouldReduceMotion,
}: {
	role: Role;
	idx: number;
	rolesLength: number;
	shouldReduceMotion: boolean;
}) {
	const [isOpen, setIsOpen] = useState(Boolean(role.current));

	const handleToggle = () => {
		setIsOpen((open) => !open);
	};

	const handleCardClick = (event: MouseEvent<HTMLDivElement>) => {
		const target = event.target as HTMLElement;
		if (target.closest("a,button")) {
			return;
		}

		handleToggle();
	};

	return (
		<div
			className={`relative grid ${rolesLength > 1 ? "grid-cols-[16px_1fr] gap-3" : "grid-cols-[0px_1fr] gap-0"} ${idx < rolesLength - 1 ? "pb-3" : ""}`}
		>
			<div className="flex justify-center">
				{rolesLength > 1 && idx > 0 && (
					<div className="absolute left-[7.5px] top-0 h-5 w-px bg-border" />
				)}
				{rolesLength > 1 && idx < rolesLength - 1 && (
					<div className="absolute bottom-0 left-[7.5px] top-5 w-px bg-border" />
				)}
				{rolesLength > 1 && (
					<div className="relative z-10 mt-5 size-2 rounded-full border border-border bg-muted" />
				)}
			</div>
			<div
				onClick={handleCardClick}
				className="rounded-lg border border-border/50 bg-background/20 px-3 py-2.5 transition-colors duration-150 hover:border-muted-foreground/35"
			>
				<div className="flex min-h-8 items-center gap-2">
					<div className="min-w-0 flex-1 self-center">
						<div className="flex items-center gap-1.5">
							<Code2 className="size-3.5 shrink-0 text-muted-foreground/80" />
							<p className="text-left text-sm font-semibold text-foreground">
								{role.title}
							</p>
						</div>
					</div>
					<div className="flex shrink-0 items-center gap-2 pl-2">
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
								Current
							</motion.span>
						)}
						<span className="whitespace-nowrap rounded-md border border-border/70 bg-background/40 px-2 py-1 font-mono text-[11px] text-muted-foreground/80">
							{role.period}
						</span>
						<button
							type="button"
							onClick={handleToggle}
							aria-expanded={isOpen}
							className="inline-flex items-center text-muted-foreground transition-colors hover:text-foreground"
						>
							<span className="sr-only">Toggle role details</span>
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
						marginTop: isOpen ? 8 : 0,
					}}
					transition={{ duration: 0.28, ease: "easeOut" }}
					className="overflow-hidden"
				>
					<div className="text-sm leading-relaxed text-muted-foreground">
						{role.description}
					</div>
				</motion.div>
			</div>
		</div>
	);
}

export function Experience() {
	const shouldReduceMotion = useReducedMotion();

	return (
		<SectionReveal delay={0.1}>
			<section className="flex flex-col gap-5">
				<h2 className="text-lg font-medium">Experience</h2>

				<div className="flex flex-col gap-4">
					{experiences.map((exp) => {
						return (
							<div
								key={exp.company}
								className="group relative rounded-xl border border-border bg-card/50 p-5 transition-colors duration-200 hover:border-muted-foreground/20"
							>
								<div className="flex flex-col gap-5">
									<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
										<div className="flex items-start gap-3">
											<div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50">
												<Briefcase className="size-4 text-muted-foreground" />
											</div>
											<div className="flex flex-col gap-1">
												<div className="flex items-center gap-2">
													<a
														href={exp.url}
														target="_blank"
														rel="noopener noreferrer"
														className="inline-flex items-center gap-1 font-medium text-foreground transition-colors hover:text-foreground/80"
													>
														{exp.company}
														<ExternalLink className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
													</a>
												</div>
												<div className="flex items-center gap-2 text-[11px] text-muted-foreground/70">
													<span>{exp.type}</span>
												</div>
											</div>
										</div>
									</div>

									<div className="flex flex-col gap-0">
										{exp.roles.map((role, idx) => (
											<ExperienceRoleCard
												key={`${exp.company}-${role.title}-${role.period}`}
												role={role}
												idx={idx}
												rolesLength={exp.roles.length}
												shouldReduceMotion={Boolean(shouldReduceMotion)}
											/>
										))}
									</div>

									<Stagger className="flex flex-wrap gap-1.5" delay={0.05}>
										{exp.techs.map((tech) => (
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
