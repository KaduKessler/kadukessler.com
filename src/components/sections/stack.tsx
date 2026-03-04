import {
	SectionReveal,
	Stagger,
	StaggerItem,
} from "@/components/ui/section-reveal";

const stackCategories = [
	{
		label: "Core",
		items: ["C#", "TypeScript", "Python", ".NET", "React"],
	},
	{
		label: "Backend",
		items: ["ASP.NET Core", "Node.js", "Django", "REST APIs", "PostgreSQL"],
	},
	{
		label: "Frontend & DevOps",
		items: ["Next.js", "Tailwind CSS", "Docker", "Linux", "Git"],
	},
];

export function Stack() {
	return (
		<SectionReveal delay={0.2}>
			<section className="flex flex-col gap-5">
				<h2 className="text-lg font-medium">Stack</h2>

				<Stagger className="flex flex-col gap-4" delay={0.05}>
					{stackCategories.map((category) => (
						<StaggerItem key={category.label} className="flex flex-col gap-2.5">
							<span className="font-mono text-xs uppercase tracking-wider text-muted-foreground/50">
								{category.label}
							</span>
							<div className="flex flex-wrap gap-2">
								{category.items.map((tech) => (
									<span
										key={tech}
										className="cursor-default rounded-lg border border-border bg-card/50 px-3 py-1.5 text-sm text-muted-foreground transition-colors duration-150 hover:border-muted-foreground/30 hover:bg-muted hover:text-foreground"
									>
										{tech}
									</span>
								))}
							</div>
						</StaggerItem>
					))}
				</Stagger>
			</section>
		</SectionReveal>
	);
}
