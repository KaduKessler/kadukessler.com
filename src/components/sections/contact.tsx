import { ArrowUpRight, Mail } from "lucide-react";
import { SectionReveal } from "@/components/ui/section-reveal";

export function Contact() {
	return (
		<SectionReveal delay={0.25}>
			<section className="flex flex-col gap-5">
				<h2 className="text-lg font-medium">Contact</h2>

				<div className="rounded-xl border border-border bg-card/50 p-6 transition-colors duration-200 hover:border-muted-foreground/20">
					<div className="flex flex-col gap-4">
						<p className="text-sm leading-relaxed text-muted-foreground">
							Feel free to reach out; whether it's about a project, a
							collaboration, an opportunity, or just to say hi. I'm always open
							to connect.
						</p>

						<div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
							<a
								href="mailto:contato@kadukessler.com"
								className="inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity duration-150 hover:opacity-90"
							>
								<Mail className="size-4" />
								Send an email
							</a>
							<a
								href="https://linkedin.com/in/kadukessler"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
							>
								LinkedIn
								<ArrowUpRight className="size-3.5" />
							</a>
						</div>
					</div>
				</div>
			</section>
		</SectionReveal>
	);
}
