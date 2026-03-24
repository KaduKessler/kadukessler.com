import { AnimatePresence, motion, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
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
	
	// Efeito Magnético
	const logoRef = useRef<HTMLButtonElement>(null);
	const [position, setPosition] = useState({ x: 0, y: 0 });

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!logoRef.current) return;
		const { clientX, clientY } = e;
		const { left, top, width, height } = logoRef.current.getBoundingClientRect();
		
		const centerX = left + width / 2;
		const centerY = top + height / 2;
		
		const moveX = (clientX - centerX) * 0.35;
		const moveY = (clientY - centerY) * 0.35;
		
		setPosition({ x: moveX, y: moveY });
	};

	const resetPosition = () => {
		setPosition({ x: 0, y: 0 });
	};

	useEffect(() => {
		const unsubScroll = scrollY.on("change", (latest) => {
			setHasScrolled(latest > 100);
		});
		return () => unsubScroll();
	}, [scrollY]);

	const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
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
				layout: { type: "spring", stiffness: 260, damping: 25 }
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
						<motion.button
							ref={logoRef}
							type="button"
							onMouseMove={handleMouseMove}
							onMouseLeave={resetPosition}
							animate={{ x: position.x, y: position.y }}
							transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
							onClick={() => {
								triggerTap?.();
								window.scrollTo({ top: 0, behavior: "smooth" });
							}}
							className="group flex cursor-pointer items-center justify-center rounded-lg px-2 py-1.5 transition-colors hover:bg-muted active:scale-90"
							aria-label="Back to top"
						>
							<img
								src="/images/kadu_logo_white.svg"
								alt=""
								className="hidden h-4.5 w-auto dark:block transition-transform group-hover:scale-110"
							/>
							<img
								src="/images/kadu_logo.svg"
								alt=""
								className="block h-4.5 w-auto dark:hidden transition-transform group-hover:scale-110"
							/>
						</motion.button>
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
