import {
	BriefcaseBusiness,
	Check,
	Clock3,
	Copy,
	Github,
	Mail,
	MapPin,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { SectionReveal } from "@/components/ui/section-reveal";
import { useTouchHaptics } from "@/lib/use-touch-haptics";

export function Hero() {
	const { triggerTap } = useTouchHaptics();
	const taglines = ["Full-Stack Junior", ".NET + React", "Above and Beyond"];
	const [activeTagline, setActiveTagline] = useState(0);
	const [now, setNow] = useState(() => new Date());
	const [copied, setCopied] = useState(false);

	const handleCopyEmail = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		navigator.clipboard.writeText("contato@kadukessler.com");
		setCopied(true);
		triggerTap?.();
		setTimeout(() => setCopied(false), 2000);
	};

	useEffect(() => {
		const intervalId = window.setInterval(() => {
			setActiveTagline((previous) => (previous + 1) % taglines.length);
		}, 3000);

		return () => {
			window.clearInterval(intervalId);
		};
	}, [taglines.length]);

	useEffect(() => {
		const timerId = window.setInterval(() => {
			setNow(new Date());
		}, 1000);

		return () => {
			window.clearInterval(timerId);
		};
	}, []);

	const santaMariaTime = new Intl.DateTimeFormat("pt-BR", {
		timeZone: "America/Sao_Paulo",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	}).format(now);

	const getUtcOffsetMinutes = (timeZone: string, date: Date) => {
		const formatter = new Intl.DateTimeFormat("en-US", {
			timeZone,
			timeZoneName: "shortOffset",
		});
		const offsetToken = formatter
			.formatToParts(date)
			.find((part) => part.type === "timeZoneName")?.value;

		if (!offsetToken) {
			return 0;
		}

		const match = offsetToken.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/);
		if (!match) {
			return 0;
		}

		const sign = match[1] === "+" ? 1 : -1;
		const hours = Number(match[2]);
		const minutes = Number(match[3] ?? "0");

		return sign * (hours * 60 + minutes);
	};

	const santaOffset = getUtcOffsetMinutes("America/Sao_Paulo", now);
	const userOffset = -now.getTimezoneOffset();
	const diffMinutes = santaOffset - userOffset;
	const absDiffHours = Math.abs(diffMinutes / 60);
	const diffHoursLabel = Number.isInteger(absDiffHours)
		? String(absDiffHours)
		: absDiffHours.toFixed(1).replace(".", ",");
	const timezoneHint =
		diffMinutes === 0
			? "same timezone as you"
			: diffMinutes > 0
				? `${diffHoursLabel}h ahead`
				: `${diffHoursLabel}h behind`;

	return (
		<SectionReveal>
			<section className="flex flex-col gap-6">
				<div className="grid grid-cols-[auto_1fr] items-start gap-4 sm:gap-5">
					<div className="mt-0.5 flex size-15 shrink-0 items-center justify-center rounded-2xl border border-border bg-card/50 p-3 sm:size-16">
						<picture>
							<source
								media="(prefers-color-scheme: dark)"
								srcSet="/images/kadu_logo_white.svg"
							/>
							<img
								src="/images/kadu_logo.svg"
								alt=""
								className="h-7 w-auto sm:h-8"
							/>
						</picture>
					</div>

					<div className="flex min-w-0 flex-col gap-2.5">
						<h1 className="text-4xl font-semibold tracking-tight sm:text-[2.6rem]">
							Kadu Kessler
						</h1>
						<p className="min-h-5 font-mono text-sm text-muted-foreground">
							<AnimatePresence mode="wait" initial={false}>
								<motion.span
									key={taglines[activeTagline]}
									initial={{ opacity: 0, y: 4, filter: "blur(1px)" }}
									animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
									exit={{ opacity: 0, y: -4, filter: "blur(1px)" }}
									transition={{ duration: 0.28, ease: "easeOut" }}
									className="inline-block"
								>
									{taglines[activeTagline]}
								</motion.span>
							</AnimatePresence>
						</p>
					</div>
				</div>

				<div className="rounded-xl border border-border bg-card/40 p-3 sm:p-4">
					<div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
						<div className="flex items-center gap-2.5">
							<div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background/50">
								<Github className="size-3.5 text-muted-foreground" />
							</div>
							<div className="flex min-w-0 flex-col">
								<span className="text-[10px] font-bold uppercase leading-none tracking-tight text-muted-foreground/50">
									GitHub
								</span>
								<a
									href="https://github.com/kadukessler"
									target="_blank"
									rel="noopener noreferrer"
									onClick={triggerTap}
									className="hero-link mt-0.5 inline-block text-xs font-medium text-foreground"
								>
									KaduKessler
								</a>
							</div>
						</div>

						<div className="group flex items-center gap-2.5">
							<div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background/50">
								<Mail className="size-3.5 text-muted-foreground" />
							</div>
							<div className="min-w-0 flex-1">
								<span className="text-[10px] font-bold uppercase leading-none tracking-tight text-muted-foreground/50">
									Email
								</span>
								<a
									href="mailto:contato@kadukessler.com"
									onClick={triggerTap}
									className="hero-link mt-0.5 block break-all text-xs font-medium text-foreground"
								>
									contato@kadukessler.com
								</a>
							</div>
							<button
								type="button"
								onClick={handleCopyEmail}
								className="ml-auto flex size-7 shrink-0 opacity-0 translate-x-1 items-center justify-center rounded-md border border-border bg-background/50 text-muted-foreground transition-all group-hover:opacity-100 group-hover:translate-x-0 hover:border-foreground/20 hover:bg-background hover:text-foreground active:scale-95"
								title="Copy email"
							>
								{copied ? (
									<Check className="size-3 text-emerald-500" />
								) : (
									<Copy className="size-3" />
								)}
							</button>
						</div>

						<div className="flex items-center gap-2.5">
							<div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background/50">
								<BriefcaseBusiness className="size-3.5 text-muted-foreground" />
							</div>
							<div className="flex min-w-0 flex-col">
								<span className="text-[10px] font-bold uppercase leading-none tracking-tight text-muted-foreground/50">
									Current Role
								</span>
								<a
									href="https://mpe.com.br/quem-somos/"
									target="_blank"
									rel="noopener noreferrer"
									onClick={triggerTap}
									className="hero-link mt-0.5 inline-block text-xs font-medium text-foreground"
								>
									Full-Stack Junior @2M/MPE
								</a>
							</div>
						</div>

						<div className="flex items-center gap-2.5">
							<div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background/50">
								<MapPin className="size-3.5 text-muted-foreground" />
							</div>
							<div className="flex min-w-0 flex-col">
								<span className="text-[10px] font-bold uppercase leading-none tracking-tight text-muted-foreground/50">
									Location
								</span>
								<a
									href="https://maps.google.com/?q=Santa+Maria,+RS"
									target="_blank"
									rel="noopener noreferrer"
									onClick={triggerTap}
									className="hero-link mt-0.5 inline-block text-xs font-medium text-foreground"
								>
									Santa Maria, RS
								</a>
							</div>
						</div>

						<div className="flex items-center gap-2.5 sm:col-span-2">
							<div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background/50 transition-all">
								<Clock3 className="size-3.5 text-muted-foreground" />
							</div>
							<div className="flex flex-col min-w-0">
								<span className="text-[10px] font-bold uppercase leading-none tracking-tight text-muted-foreground/50">
									Local Time
								</span>
								<div className="mt-0.5 flex items-center gap-2 text-xs font-medium tabular-nums text-foreground">
									<span>{santaMariaTime}</span>
									<span className="opacity-30">•</span>
									<span className="text-muted-foreground/70">
										{timezoneHint}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</SectionReveal>
	);
}
