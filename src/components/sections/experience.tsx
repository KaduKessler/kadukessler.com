import { Briefcase, ExternalLink } from "lucide-react";
import {
	SectionReveal,
	Stagger,
	StaggerItem,
} from "@/components/ui/section-reveal";

const experiences = [
	{
		company: "2M/MPE",
		url: "https://mpe.com.br/quem-somos/",
		role: "Full-Stack Trainee",
		type: "CLT",
		period: "12.2025 — Present",
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
				security platform. Focused on scalable monitoring, real-time events, and
				high-performance infrastructure.
			</>
		),
		techs: [".NET", "React", "TypeScript", "IoT", "PostgreSQL", "Docker"],
	},
	{
		company: "Self-employed",
		url: "https://kadukessler.com",
		role: "Web Developer",
		type: "Freelance",
		period: "12.2024 — 12.2025",
		current: false,
		description:
			"Delivered institutional websites in WordPress with responsive design, hosting/domain setup, plugin customization, and SEO/performance improvements.",
		techs: ["WordPress", "Elementor", "Figma", "SEO", "DNS"],
	},
	{
		company: "Eloo Perícias",
		url: "https://eloopericias.com.br",
		role: "Software Developer",
		type: "Contract (ad-hoc)",
		period: "05.2022 — 12.2024",
		current: false,
		description:
			"Built automation tools for data collection, report generation, and financial workflows, including web systems and VBA scripts for internal operations.",
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

export function Experience() {
	return (
		<SectionReveal delay={0.1}>
			<section className="flex flex-col gap-5">
				<h2 className="text-lg font-medium">Experience</h2>

				<div className="flex flex-col gap-4">
					{experiences.map((exp) => (
						<div
							key={exp.company}
							className="group rounded-xl border border-border bg-card/50 p-5 transition-colors duration-200 hover:border-muted-foreground/20"
						>
							<div className="flex flex-col gap-4">
								<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
									<div className="flex items-start gap-3">
										<div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50">
											<Briefcase className="size-4 text-muted-foreground" />
										</div>
										<div className="flex flex-col gap-0.5">
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
												{exp.current && (
													<span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-400">
														Current
													</span>
												)}
											</div>
											<p className="text-sm text-muted-foreground">
												{exp.role}
											</p>
										</div>
									</div>
									<div className="flex flex-col items-end gap-0.5 text-right">
										<span className="font-mono text-xs text-muted-foreground/70">
											{exp.period}
										</span>
										<span className="text-xs text-muted-foreground/50">
											{exp.type}
										</span>
									</div>
								</div>

								<p className="text-sm leading-relaxed text-muted-foreground">
									{exp.description}
								</p>

								<Stagger className="flex flex-wrap gap-1.5" delay={0.05}>
									{exp.techs.map((tech) => (
										<StaggerItem key={tech}>
											<TechPill name={tech} />
										</StaggerItem>
									))}
								</Stagger>
							</div>
						</div>
					))}
				</div>
			</section>
		</SectionReveal>
	);
}
