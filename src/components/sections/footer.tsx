import { SectionReveal } from "@/components/ui/section-reveal";

export function Footer() {
	return (
		<SectionReveal delay={0.3}>
			<footer className="flex flex-col gap-6 border-t border-border pt-8 pb-12">
				<div className="flex items-center justify-between">
					<p className="text-xs text-muted-foreground/60">
						Built by{" "}
						<a
							href="https://github.com/kadukessler"
							target="_blank"
							rel="noopener noreferrer"
							className="text-muted-foreground transition-colors hover:text-foreground"
						>
							Kadu Kessler
						</a>{" "}
						· {new Date().getFullYear()}
					</p>
				</div>
			</footer>
		</SectionReveal>
	);
}
