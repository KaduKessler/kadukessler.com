import { ArrowUpRight, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageReveal } from "@/components/ui/language-reveal";
import { SectionReveal } from "@/components/ui/section-reveal";
import { useTouchHaptics } from "@/lib/use-touch-haptics";

export function Contact() {
	const { t } = useTranslation();
	const { triggerTap, triggerPrimaryAction } = useTouchHaptics();

	return (
		<SectionReveal delay={0.25}>
			<section className="flex flex-col gap-5">
				<h2 className="text-xl font-semibold tracking-tight">
					<LanguageReveal inline>{t("contact.title")}</LanguageReveal>
				</h2>

				<div className="card-elevated rounded-xl border border-border bg-card p-6 transition-colors duration-200 hover:border-muted-foreground/40">
					<div className="flex flex-col gap-4">
						<LanguageReveal className="text-sm leading-relaxed text-foreground/80">
							{t("contact.description")}
						</LanguageReveal>

						<div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
							<a
								href="mailto:contato@kadukessler.com"
								onClick={triggerPrimaryAction}
								className="inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity duration-150 hover:opacity-90"
							>
								<Mail className="size-4" />
								<LanguageReveal inline>{t("contact.sendEmail")}</LanguageReveal>
							</a>
							<a
								href="https://linkedin.com/in/kadukessler"
								target="_blank"
								rel="noopener noreferrer"
								onClick={triggerTap}
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
