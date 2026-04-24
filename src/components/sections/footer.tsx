import { useTranslation } from "react-i18next";
import { SectionReveal } from "@/components/ui/section-reveal";
import { useTouchHaptics } from "@/lib/use-touch-haptics";

export function Footer() {
	const { t } = useTranslation();
	const { triggerTap } = useTouchHaptics();

	return (
		<SectionReveal delay={0.3}>
			<footer className="mt-8 border-t border-border/40 py-10">
				<div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
					<p className="text-xs text-muted-foreground/60">
						{t("footer.builtBy")}{" "}
						<a
							href="https://github.com/kadukessler"
							target="_blank"
							rel="noopener noreferrer"
							onClick={triggerTap}
							className="font-medium text-muted-foreground transition-colors hover:text-foreground"
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
