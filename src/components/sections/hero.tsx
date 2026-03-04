import { BriefcaseBusiness, GraduationCap, MapPin } from "lucide-react";
import { SectionReveal } from "@/components/ui/section-reveal";
import { useTouchHaptics } from "@/lib/use-touch-haptics";

export function Hero() {
	const { triggerTap } = useTouchHaptics();

	return (
		<SectionReveal>
			<section className="flex flex-col gap-8">
				<div className="flex flex-col gap-2">
					<h1 className="text-4xl font-semibold tracking-tight">
						Kadu Kessler
					</h1>
					<p className="font-mono text-sm text-muted-foreground">
						Above and beyond.
					</p>
				</div>

				<div className="rounded-xl border border-border bg-card/50 p-5 transition-colors duration-200 hover:border-muted-foreground/20">
					<div className="flex flex-col gap-3">
						<div className="flex flex-col gap-1.5 text-sm">
							<p className="inline-flex items-center gap-2 text-foreground">
								<BriefcaseBusiness className="size-3.5 text-muted-foreground" />
								Full-Stack Developer{" "}
								<a
									href="https://mpe.com.br/quem-somos/"
									target="_blank"
									rel="noopener noreferrer"
									onClick={triggerTap}
									className="text-muted-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
								>
									@2M/MPE
								</a>
							</p>
							<p className="inline-flex items-center gap-2 text-foreground">
								<GraduationCap className="size-3.5 text-muted-foreground" />
								ADS Student{" "}
								<a
									href="https://www.pucrs.br/"
									target="_blank"
									rel="noopener noreferrer"
									onClick={triggerTap}
									className="text-muted-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
								>
									@PUCRS
								</a>
							</p>
						</div>

						<a
							href="https://maps.google.com/?q=Santa+Maria,+RS"
							target="_blank"
							rel="noopener noreferrer"
							onClick={triggerTap}
							className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
						>
							<MapPin className="size-3.5" />
							Santa Maria, RS
						</a>
					</div>
				</div>
			</section>
		</SectionReveal>
	);
}
