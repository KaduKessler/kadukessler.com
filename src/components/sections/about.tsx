import {
	SectionReveal,
	Stagger,
	StaggerItem,
} from "@/components/ui/section-reveal";

export function About() {
	return (
		<SectionReveal delay={0.05}>
			<section className="flex flex-col gap-5">
				<h2 className="text-lg font-medium">About</h2>

				<div className="rounded-xl border border-border bg-card/50 p-5 transition-colors duration-200 hover:border-muted-foreground/20">
					<Stagger
						className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground"
						delay={0.08}
					>
						<StaggerItem>
							<p>
								Full-Stack Developer focused on{" "}
								<span className="font-medium text-foreground">.NET</span> and{" "}
								<span className="font-medium text-foreground">React</span>,
								currently working as a{" "}
								<span className="font-medium text-foreground">Trainee</span> at{" "}
								<span className="font-medium text-foreground">2M/MPE</span>. I
								build production-ready systems, integrate IoT devices, and
								manage complex data flows.
							</p>
						</StaggerItem>
						<StaggerItem>
							<p>
								I'm a core contributor to{" "}
								<span className="font-medium text-foreground">AlertAI</span> , a
								web platform for event management, security, and intelligent
								monitoring. Currently finishing my degree in{" "}
								<span className="font-medium text-foreground">
									Analysis and Systems Development
								</span>{" "}
								at <span className="font-medium text-foreground">PUCRS</span>.
							</p>
						</StaggerItem>
						<StaggerItem>
							<p>
								Beyond building software, I enjoy infrastructure and
								understanding how things work from end-to-end. I run a home
								setup with{" "}
								<span className="font-medium text-foreground">Proxmox</span> and
								manage cloud instances on{" "}
								<span className="font-medium text-foreground">
									OCI (Oracle Linux)
								</span>{" "}
								to host my own services and experiment with the DevOps mindset.
							</p>
						</StaggerItem>
						<StaggerItem>
							<p>
								In my free time, I'm usually iterating on new ideas, watching
								anime, or gaming; always driven by the curiosity of creating
								practical solutions.
							</p>
						</StaggerItem>
					</Stagger>
				</div>
			</section>
		</SectionReveal>
	);
}
