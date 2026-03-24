import { AnimatePresence, motion, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTouchHaptics } from "@/lib/use-touch-haptics";

const navItems = [
	{ label: "About", href: "#about" },
	{ label: "Experience", href: "#experience" },
	{ label: "Education", href: "#education" },
	{ label: "Stack", href: "#stack" },
];

export function FloatingNav() {
	const { triggerTap } = useTouchHaptics();
	const { scrollY } = useScroll();
	const [hasScrolled, setHasScrolled] = useState(false);

	useEffect(() => {
		const unsubScroll = scrollY.on("change", (latest) => {
			setHasScrolled(latest > 100);
		});
		return () => unsubScroll();
	}, [scrollY]);

	const handleScroll = (
		e: React.MouseEvent<HTMLAnchorElement>,
		href: string,
	) => {
		e.preventDefault();
		triggerTap?.();
		const targetId = href.replace("#", "");
		const elem = document.getElementById(targetId);
		elem?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<motion.nav
			layout
			initial={false}
			className="fixed top-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-border bg-background/60 p-1.5 backdrop-blur-md sm:gap-2 sm:px-3"
			transition={{
				layout: { type: "spring", stiffness: 260, damping: 25 },
			}}
		>
			<AnimatePresence mode="popLayout" initial={false}>
				{hasScrolled && (
					<motion.div
						key="logo"
						layout
						initial={{ opacity: 0, scale: 0, rotate: -45 }}
						animate={{ opacity: 1, scale: 1, rotate: 0 }}
						exit={{ opacity: 0, scale: 0, rotate: -45 }}
						transition={{ type: "spring", stiffness: 260, damping: 20 }}
						className="flex items-center justify-center pl-1.5 pr-1"
					>
						<button
							type="button"
							onClick={() => {
								triggerTap?.();
								window.scrollTo({ top: 0, behavior: "smooth" });
							}}
							className="flex items-center justify-center transition-transform hover:scale-110 active:scale-90"
							aria-label="Back to top"
						>
							<img
								src="/images/kadu_logo_white.svg"
								alt=""
								className="hidden h-4.5 w-auto dark:block"
							/>
							<img
								src="/images/kadu_logo.svg"
								alt=""
								className="block h-4.5 w-auto dark:hidden"
							/>
						</button>
					</motion.div>
				)}
			</AnimatePresence>

			<motion.ul layout className="flex items-center gap-0.5 sm:gap-1">
				{navItems.map((item) => (
					<motion.li layout key={item.label} className="flex items-center">
						<a
							href={item.href}
							onClick={(e) => handleScroll(e, item.href)}
							className="rounded-full px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:text-xs"
						>
							{item.label}
						</a>
					</motion.li>
				))}
			</motion.ul>

			<motion.div layout className="flex items-center">
				<ThemeToggle />
			</motion.div>
		</motion.nav>
	);
}
