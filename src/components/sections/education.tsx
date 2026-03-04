import { GraduationCap } from "lucide-react";
import { SectionReveal } from "@/components/ui/section-reveal";

const education = [
	{
		institution: "PUCRS",
		fullName: "Pontifícia Universidade Católica do Rio Grande do Sul",
		course: "Analysis and Systems Development",
		period: "02.2024 — 2026",
		current: true,
	},
	{
		institution: "UFSM",
		fullName: "Universidade Federal de Santa Maria",
		course: "Technical Degree in Informatics",
		period: "05.2021 — 12.2023",
		current: false,
	},
];

export function Education() {
	return (
		<SectionReveal delay={0.15}>
			<section className="flex flex-col gap-5">
				<h2 className="text-lg font-medium">Education</h2>

				<div className="flex flex-col gap-4">
					{education.map((edu) => (
						<div
							key={edu.institution}
							className="rounded-xl border border-border bg-card/50 p-5 transition-colors duration-200 hover:border-muted-foreground/20"
						>
							<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
								<div className="flex items-start gap-3">
									<div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50">
										<GraduationCap className="size-4 text-muted-foreground" />
									</div>
									<div className="flex flex-col gap-0.5">
										<div className="flex items-center gap-2">
											<span className="font-medium text-foreground">
												{edu.institution}
											</span>
											{edu.current && (
												<span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-blue-400">
													In progress
												</span>
											)}
										</div>
										<p className="text-sm text-muted-foreground">
											{edu.course}
										</p>
										<p className="text-xs text-muted-foreground/50">
											{edu.fullName}
										</p>
									</div>
								</div>
								<span className="font-mono text-xs text-muted-foreground/70">
									{edu.period}
								</span>
							</div>
						</div>
					))}
				</div>
			</section>
		</SectionReveal>
	);
}
