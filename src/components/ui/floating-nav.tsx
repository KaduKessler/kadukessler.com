import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTouchHaptics } from "@/lib/use-touch-haptics";
import { cn } from "@/lib/utils";

const navItems = [
	{ label: "About", href: "#about" },
	{ label: "Experience", href: "#experience" },
	{ label: "Education", href: "#education" },
	{ label: "Stack", href: "#stack" },
];

export function FloatingNav() {
	const [isMobile, setIsMobile] = useState(false);
	const { scrollY } = useScroll();
	const [hasScrolled, setHasScrolled] = useState(false);
	const [activeSection, setActiveSection] = useState("");

	useEffect(() => {
		const mql = window.matchMedia("(max-width: 768px)");
		const checkMobile = () => setIsMobile(mql.matches);
		checkMobile();
		mql.addEventListener("change", checkMobile);

		const unsubScroll = scrollY.on("change", (latest) => {
			setHasScrolled(latest > 100);
		});

		const options = {
			root: null,
			rootMargin: "-20% 0px -70% 0px",
			threshold: 0,
		};

		const observer = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					setActiveSection(entry.target.id);
				}
			}
		}, options);

		for (const item of navItems) {
			const id = item.href.replace("#", "");
			const el = document.getElementById(id);
			if (el) observer.observe(el);
		}

		return () => {
			mql.removeEventListener("change", checkMobile);
			unsubScroll();
			observer.disconnect();
		};
	}, [scrollY]);

	if (isMobile) {
		return (
			<MobileNav activeSection={activeSection} hasScrolled={hasScrolled} />
		);
	}

	return <DesktopNav activeSection={activeSection} hasScrolled={hasScrolled} />;
}

function DesktopNav({
	activeSection,
	hasScrolled,
}: {
	activeSection: string;
	hasScrolled: boolean;
}) {
	const { triggerTap } = useTouchHaptics();
	const logoRef = useRef<HTMLButtonElement>(null);
	const [position, setPosition] = useState({ x: 0, y: 0 });

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!logoRef.current) return;
		const { clientX, clientY } = e;
		const { left, top, width, height } =
			logoRef.current.getBoundingClientRect();
		const centerX = left + width / 2;
		const centerY = top + height / 2;
		const moveX = (clientX - centerX) * 0.35;
		const moveY = (clientY - centerY) * 0.35;
		setPosition({ x: moveX, y: moveY });
	};

	const resetPosition = () => setPosition({ x: 0, y: 0 });

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
			className="fixed top-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-background/60 p-1.5 px-3 backdrop-blur-md"
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
						<motion.button
							ref={logoRef}
							type="button"
							onMouseMove={handleMouseMove}
							onMouseLeave={resetPosition}
							animate={{ x: position.x, y: position.y }}
							transition={{
								type: "spring",
								stiffness: 150,
								damping: 15,
								mass: 0.1,
							}}
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

			<motion.ul layout className="flex items-center gap-1">
				{navItems.map((item) => {
					const isActive = activeSection === item.href.replace("#", "");
					return (
						<motion.li layout key={item.label} className="flex items-center">
							<a
								href={item.href}
								onClick={(e) => handleScroll(e, item.href)}
								className={cn(
									"relative rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors",
									isActive
										? "text-foreground bg-muted/50"
										: "text-muted-foreground hover:bg-muted hover:text-foreground",
								)}
							>
								{item.label}
								{isActive && (
									<motion.div
										layoutId="activeSection"
										className="absolute inset-0 z-[-1] rounded-full bg-muted shadow-sm"
										transition={{ type: "spring", stiffness: 380, damping: 30 }}
									/>
								)}
							</a>
						</motion.li>
					);
				})}
			</motion.ul>

			<motion.div layout className="flex items-center">
				<ThemeToggle />
			</motion.div>
		</motion.nav>
	);
}

function MobileNav({
	activeSection,
	hasScrolled,
}: {
	activeSection: string;
	hasScrolled: boolean;
}) {
	const { triggerTap } = useTouchHaptics();
	const [isOpen, setIsOpen] = useState(false);

	const handleScroll = (
		e: React.MouseEvent<HTMLAnchorElement>,
		href: string,
	) => {
		e.preventDefault();
		triggerTap?.();
		setIsOpen(false);
		const targetId = href.replace("#", "");
		const elem = document.getElementById(targetId);
		elem?.scrollIntoView({ behavior: "smooth" });
	};

	const activeLabel =
		navItems.find((i) => i.href.replace("#", "") === activeSection)?.label ||
		"Menu";

	return (
		<div className="fixed top-6 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2 px-4 w-full max-w-[320px]">
			<motion.nav
				layout
				transition={{ type: "spring", stiffness: 260, damping: 25 }}
				className="flex w-full items-center justify-between rounded-full border border-border bg-background/60 p-1.5 px-4 backdrop-blur-md shadow-lg"
			>
				<div className="flex flex-1 items-center min-w-0">
					{/* Logo Container com animação de largura para evitar sobreposição */}
					<motion.div
						animate={{
							width: hasScrolled ? "auto" : 0,
							opacity: hasScrolled ? 1 : 0,
							marginRight: hasScrolled ? 16 : 0,
						}}
						initial={false}
						transition={{ type: "spring", stiffness: 300, damping: 30 }}
						className="overflow-hidden flex-shrink-0"
					>
						<button
							type="button"
							onClick={() => {
								triggerTap?.();
								window.scrollTo({ top: 0, behavior: "smooth" });
							}}
							className="flex items-center justify-center py-1 active:scale-90 transition-transform"
							aria-label="Back to top"
						>
							<img
								src="/images/kadu_logo_white.svg"
								alt=""
								className="hidden h-5 w-auto dark:block"
							/>
							<img
								src="/images/kadu_logo.svg"
								alt=""
								className="block h-5 w-auto dark:hidden"
							/>
						</button>
					</motion.div>

					{/* Seção Ativa (Texto Solto) */}
					<motion.button
						layout
						type="button"
						onClick={() => {
							triggerTap?.();
							setIsOpen(!isOpen);
						}}
						className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/80 active:opacity-60 transition-opacity truncate"
					>
						<span className="truncate">{activeLabel}</span>
						<motion.div
							animate={{ rotate: isOpen ? 180 : 0 }}
							transition={{ type: "spring", stiffness: 260, damping: 20 }}
							className="flex-shrink-0"
						>
							<ChevronDown className="size-3 text-muted-foreground" />
						</motion.div>
					</motion.button>
				</div>

				<div className="flex items-center pl-2 flex-shrink-0">
					<ThemeToggle />
				</div>
			</motion.nav>

			{/* Menu Dropdown Expandível */}
			<AnimatePresence>
				{isOpen && (
					<motion.ul
						initial={{ opacity: 0, y: -10, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -10, scale: 0.95 }}
						transition={{ type: "spring", stiffness: 300, damping: 25 }}
						className="flex w-full flex-col gap-1 overflow-hidden rounded-2xl border border-border bg-background/80 p-1.5 backdrop-blur-md shadow-xl"
					>
						{navItems.map((item) => {
							const isActive = activeSection === item.href.replace("#", "");
							return (
								<li key={item.label}>
									<a
										href={item.href}
										onClick={(e) => handleScroll(e, item.href)}
										className={cn(
											"flex w-full items-center justify-center rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98]",
											isActive
												? "bg-muted text-foreground"
												: "text-muted-foreground hover:bg-muted/50",
										)}
									>
										{item.label}
									</a>
								</li>
							);
						})}
					</motion.ul>
				)}
			</AnimatePresence>
		</div>
	);
}
