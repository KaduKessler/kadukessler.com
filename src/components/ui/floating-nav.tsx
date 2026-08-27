import { ChevronDown } from "lucide-react";
import {
	type CSSProperties,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { LanguageReveal } from "@/components/ui/language-reveal";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { BLOG_ENABLED } from "@/lib/flags";
import { useDelayedUnmount } from "@/lib/use-delayed-unmount";
import { useTouchHaptics } from "@/lib/use-touch-haptics";
import { cn } from "@/lib/utils";

/**
 * CSS-only replacement for this file's framer-motion usage (layout
 * animation, layoutId shared-element pill, spring-physics hover tilt,
 * AnimatePresence mount/unmount). None of those have an exact CSS
 * equivalent — springs become cubic-bezier transitions, the layoutId
 * pill becomes a manually-measured sliding indicator, AnimatePresence's
 * exit-before-unmount becomes a delayed-unmount hook. Close visually,
 * not identical, in exchange for not shipping the motion vendor chunk
 * on every page (this nav is always mounted).
 */

type NavItem = {
	key: string;
	href: string;
	type: "section" | "route";
};

const allNavItems = [
	{ key: "projects", href: "#projects", type: "section" },
	{ key: "about", href: "#about", type: "section" },
	{ key: "experience", href: "#experience", type: "section" },
	{ key: "education", href: "#education", type: "section" },
	{ key: "stack", href: "#stack", type: "section" },
	{ key: "blog", href: "/blog", type: "route" },
] as const satisfies ReadonlyArray<NavItem>;

const navItems = allNavItems.filter(
	(item) => item.key !== "blog" || BLOG_ENABLED,
);

export function FloatingNav() {
	const [isMobile, setIsMobile] = useState(false);
	const [hasScrolled, setHasScrolled] = useState(false);
	const [activeSection, setActiveSection] = useState("");

	useEffect(() => {
		const mql = window.matchMedia("(max-width: 768px)");
		const checkMobile = () => setIsMobile(mql.matches);
		checkMobile();
		mql.addEventListener("change", checkMobile);

		const onScroll = () => setHasScrolled(window.scrollY > 100);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });

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

		for (const item of navItems.filter(
			(navItem) => navItem.type === "section",
		)) {
			const id = item.href.replace("#", "");
			const el = document.getElementById(id);
			if (el) observer.observe(el);
		}

		return () => {
			mql.removeEventListener("change", checkMobile);
			window.removeEventListener("scroll", onScroll);
			observer.disconnect();
		};
	}, []);

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
	const { t } = useTranslation();
	const { triggerTap } = useTouchHaptics();
	const logoRef = useRef<HTMLButtonElement>(null);
	const listRef = useRef<HTMLUListElement>(null);
	const itemRefs = useRef<Map<string, HTMLLIElement>>(new Map());
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [pill, setPill] = useState<{ left: number; width: number } | null>(
		null,
	);

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

	useLayoutEffect(() => {
		const activeEl = itemRefs.current.get(activeSection);
		const listEl = listRef.current;
		if (!activeEl || !listEl) {
			setPill(null);
			return;
		}
		const listBox = listEl.getBoundingClientRect();
		const itemBox = activeEl.getBoundingClientRect();
		setPill({ left: itemBox.left - listBox.left, width: itemBox.width });
	}, [activeSection]);

	return (
		<nav className="fixed top-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-background/60 p-1.5 px-3 backdrop-blur-md">
			<div
				className="grid transition-[grid-template-columns] duration-300 ease-out"
				style={{
					gridTemplateColumns: hasScrolled ? "1fr" : "0fr",
				}}
			>
				<div className="flex items-center justify-center overflow-hidden">
					<button
						ref={logoRef}
						type="button"
						onMouseMove={handleMouseMove}
						onMouseLeave={resetPosition}
						onClick={() => {
							triggerTap?.();
							window.scrollTo({ top: 0, behavior: "smooth" });
						}}
						style={{
							transform: `translate(${position.x}px, ${position.y}px) scale(${hasScrolled ? 1 : 0}) rotate(${hasScrolled ? 0 : -45}deg)`,
							opacity: hasScrolled ? 1 : 0,
						}}
						className="group flex cursor-pointer items-center justify-center rounded-lg px-2 py-1.5 [transition:transform_0.25s_cubic-bezier(0.16,1,0.3,1),opacity_0.2s_ease-out] hover:bg-muted active:scale-90"
						aria-label={t("common.backToTop")}
					>
						<img
							src="/images/kadu_logo_white.svg"
							alt=""
							width={20}
							height={20}
							className="hidden dark:block max-w-none transition-transform group-hover:scale-110"
							style={{ width: "20px", height: "20px" }}
						/>
						<img
							src="/images/kadu_logo.svg"
							alt=""
							width={20}
							height={20}
							className="block dark:hidden max-w-none transition-transform group-hover:scale-110"
							style={{ width: "20px", height: "20px" }}
						/>
					</button>
				</div>
			</div>

			<ul ref={listRef} className="relative flex items-center gap-1">
				{pill && (
					<span
						className="absolute inset-y-0 z-[-1] rounded-full bg-muted shadow-sm transition-[left,width] duration-300 ease-out"
						style={{ left: pill.left, width: pill.width }}
					/>
				)}
				{navItems.map((item) => {
					const isActive =
						item.type === "section" &&
						activeSection === item.href.replace("#", "");
					return (
						<li
							key={item.key}
							ref={(el) => {
								if (el) itemRefs.current.set(item.href.replace("#", ""), el);
								else itemRefs.current.delete(item.href.replace("#", ""));
							}}
							className="flex items-center"
						>
							{item.type === "section" ? (
								<a
									href={item.href}
									onClick={(e) => handleScroll(e, item.href)}
									className={cn(
										"relative rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors",
										isActive
											? "text-foreground"
											: "text-muted-foreground hover:bg-muted hover:text-foreground",
									)}
								>
									<LanguageReveal inline>{t(`nav.${item.key}`)}</LanguageReveal>
								</a>
							) : (
								<Link
									to={item.href}
									onClick={triggerTap}
									className="relative rounded-full px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
								>
									<LanguageReveal inline>{t(`nav.${item.key}`)}</LanguageReveal>
								</Link>
							)}
						</li>
					);
				})}
			</ul>

			<div className="flex items-center gap-1 ml-1 pl-1 border-l border-border/40">
				<LanguageToggle />
				<ThemeToggle />
			</div>
		</nav>
	);
}

function MobileNav({
	activeSection,
	hasScrolled,
}: {
	activeSection: string;
	hasScrolled: boolean;
}) {
	const { t } = useTranslation();
	const { triggerTap } = useTouchHaptics();
	const [isOpen, setIsOpen] = useState(false);
	const menuMounted = useDelayedUnmount(isOpen, 220);

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

	const activeItem = navItems.find(
		(item) =>
			item.type === "section" && item.href.replace("#", "") === activeSection,
	);

	const activeLabel = activeItem ? t(`nav.${activeItem.key}`) : t("nav.menu");

	const menuStyle: CSSProperties = {
		opacity: isOpen ? 1 : 0,
		transform: isOpen
			? "translateY(0) scale(1)"
			: "translateY(-10px) scale(0.95)",
	};

	return (
		<div className="fixed top-6 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2 px-4 w-full max-w-[340px]">
			<nav className="flex w-full items-center justify-between rounded-full border border-border bg-background/60 p-1.5 px-4 backdrop-blur-md shadow-lg">
				<div className="flex flex-1 items-center min-w-0">
					<div
						style={{ gridTemplateColumns: hasScrolled ? "1fr" : "0fr" }}
						className="grid shrink-0 transition-[grid-template-columns] duration-300 ease-out"
					>
						<div
							style={{ opacity: hasScrolled ? 1 : 0 }}
							className="flex items-center justify-center overflow-hidden pr-4 transition-opacity duration-200 ease-out"
						>
							<button
								type="button"
								onClick={() => {
									triggerTap?.();
									window.scrollTo({ top: 0, behavior: "smooth" });
								}}
								className="flex items-center justify-center py-1 active:scale-90 transition-transform"
								aria-label={t("common.backToTop")}
							>
								<img
									src="/images/kadu_logo_white.svg"
									alt=""
									width={20}
									height={20}
									className="hidden h-5 w-auto dark:block"
								/>
								<img
									src="/images/kadu_logo.svg"
									alt=""
									width={20}
									height={20}
									className="block h-5 w-auto dark:hidden"
								/>
							</button>
						</div>
					</div>

					<button
						type="button"
						onClick={() => {
							triggerTap?.();
							setIsOpen(!isOpen);
						}}
						className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-foreground/80 active:opacity-60 transition-opacity truncate"
					>
						<LanguageReveal inline className="truncate">
							{activeLabel}
						</LanguageReveal>
						<div
							style={{
								transform: `rotate(${isOpen ? 180 : 0}deg)`,
							}}
							className="shrink-0 [transition:transform_0.25s_ease-out]"
						>
							<ChevronDown className="size-3 text-muted-foreground" />
						</div>
					</button>
				</div>

				<div className="flex items-center gap-1 pl-2 shrink-0 border-l border-border/40 ml-2">
					<LanguageToggle />
					<ThemeToggle />
				</div>
			</nav>

			{menuMounted && (
				<ul
					style={menuStyle}
					className="flex w-full flex-col gap-1 overflow-hidden rounded-2xl border border-border bg-background/80 p-1.5 backdrop-blur-md shadow-xl [transition:opacity_0.22s_ease-out,transform_0.22s_ease-out]"
				>
					{navItems.map((item) => {
						const isActive =
							item.type === "section" &&
							activeSection === item.href.replace("#", "");
						return (
							<li key={item.key}>
								{item.type === "section" ? (
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
										<LanguageReveal inline>
											{t(`nav.${item.key}`)}
										</LanguageReveal>
									</a>
								) : (
									<Link
										to={item.href}
										onClick={() => {
											triggerTap?.();
											setIsOpen(false);
										}}
										className="flex w-full items-center justify-center rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-all hover:bg-muted/50 active:scale-[0.98]"
									>
										<LanguageReveal inline>
											{t(`nav.${item.key}`)}
										</LanguageReveal>
									</Link>
								)}
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}
