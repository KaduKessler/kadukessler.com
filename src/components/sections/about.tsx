import { Trans, useTranslation } from "react-i18next";
import { LanguageReveal } from "@/components/ui/language-reveal";
import {
	SectionReveal,
	Stagger,
	StaggerItem,
} from "@/components/ui/section-reveal";

export function About() {
	const { t } = useTranslation();

	return (
		<SectionReveal delay={0.05}>
			<section className="flex flex-col gap-5">
				<h2 className="text-lg font-medium">
					<LanguageReveal inline>{t("about.title")}</LanguageReveal>
				</h2>

				<div className="card-elevated rounded-xl border border-border bg-card p-5 transition-colors duration-200 hover:border-muted-foreground/40">
					<Stagger
						className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground"
						delay={0.08}
					>
						<StaggerItem>
							<LanguageReveal>
								<Trans
									i18nKey="about.p1"
									components={{
										dotnet: <span className="font-medium text-foreground" />,
										react: <span className="font-medium text-foreground" />,
										role: <span className="font-medium text-foreground" />,
										company: <span className="font-medium text-foreground" />,
									}}
								>
									Full-Stack Developer focused on <dotnet>.NET</dotnet> and{" "}
									<react>React</react>, currently working as a{" "}
									<role>Full-Stack Junior</role> at <company>2M/MPE</company>. I
									build production-ready systems, integrate IoT devices, and
									manage complex data flows.
								</Trans>
							</LanguageReveal>
						</StaggerItem>
						<StaggerItem>
							<LanguageReveal>
								<Trans
									i18nKey="about.p2"
									components={{
										alertai: <span className="font-medium text-foreground" />,
										course: <span className="font-medium text-foreground" />,
										uni: <span className="font-medium text-foreground" />,
									}}
								>
									I'm a core contributor to <alertai>AlertAI</alertai>, a web
									platform for event management, security, and intelligent
									monitoring. Currently finishing my degree in{" "}
									<course>Analysis and Systems Development</course> at{" "}
									<uni>PUCRS</uni>.
								</Trans>
							</LanguageReveal>
						</StaggerItem>
						<StaggerItem>
							<LanguageReveal>
								<Trans
									i18nKey="about.p3"
									components={{
										proxmox: <span className="font-medium text-foreground" />,
										oci: <span className="font-medium text-foreground" />,
									}}
								>
									Beyond building software, I enjoy infrastructure and
									understanding how things work from end-to-end. I run a home
									setup with <proxmox>Proxmox</proxmox> and manage cloud
									instances on <oci>OCI (Oracle Linux)</oci> to host my own
									services and experiment with the DevOps mindset.
								</Trans>
							</LanguageReveal>
						</StaggerItem>
						<StaggerItem>
							<LanguageReveal>{t("about.p4")}</LanguageReveal>
						</StaggerItem>
					</Stagger>
				</div>
			</section>
		</SectionReveal>
	);
}
