import { Home, Target } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTouchHaptics } from "@/lib/use-touch-haptics";

export function NotFound() {
	const { triggerTap } = useTouchHaptics();
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);

	const springConfig = { damping: 50, stiffness: 100, mass: 0.5 };
	const smoothX = useSpring(mouseX, springConfig);
	const smoothY = useSpring(mouseY, springConfig);

	// ONLY STARS PARALLAX RATIOS
	const bgStarsX = useTransform(smoothX, (v) => v * 0.3);
	const bgStarsY = useTransform(smoothY, (v) => v * 0.3);
	const midStarsX = useTransform(smoothX, (v) => v * 0.6);
	const midStarsY = useTransform(smoothY, (v) => v * 0.6);
	const fgDustX = useTransform(smoothX, (v) => v * 1.8);
	const fgDustY = useTransform(smoothY, (v) => v * 1.8);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			const moveX = (e.clientX - window.innerWidth / 2) * 0.2;
			const moveY = (e.clientY - window.innerHeight / 2) * 0.2;
			mouseX.set(moveX);
			mouseY.set(moveY);
		};
		window.addEventListener("mousemove", handleMouseMove, { passive: true });
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, [mouseX, mouseY]);

	const stars = useMemo(
		() => ({
			bg: [...Array(100)].map((_, i) => ({
				id: `bg-${i}`,
				top: `${Math.random() * 100}%`,
				left: `${Math.random() * 100}%`,
				size: Math.random() > 0.8 ? 2 : 1,
			})),
			mid: [...Array(40)].map((_, i) => ({
				id: `mid-${i}`,
				top: `${Math.random() * 100}%`,
				left: `${Math.random() * 100}%`,
				duration: 2 + Math.random() * 4,
			})),
			fg: [...Array(20)].map((_, i) => ({
				id: `fg-${i}`,
				top: `${Math.random() * 100}%`,
				left: `${Math.random() * 100}%`,
				duration: 10 + Math.random() * 10,
			})),
		}),
		[],
	);

	return (
		<div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-[#020202] px-4 text-center select-none antialiased font-sans cursor-default">
			{/* --- PARALLAX BACKGROUND (STARS ONLY) --- */}

			{/* LAYER 1: Deep Background Stars */}
			<motion.div
				style={{ x: bgStarsX, y: bgStarsY, translateZ: 0 }}
				className="absolute inset-[-10%] z-0 pointer-events-none opacity-20 will-change-transform"
			>
				{stars.bg.map((star) => (
					<div
						key={star.id}
						className="absolute bg-white rounded-full"
						style={{
							top: star.top,
							left: star.left,
							width: star.size,
							height: star.size,
						}}
					/>
				))}
			</motion.div>

			{/* LAYER 2: Midground Twinkling */}
			<motion.div
				style={{ x: midStarsX, y: midStarsY, translateZ: 0 }}
				className="absolute inset-[-15%] z-0 pointer-events-none will-change-transform"
			>
				{stars.mid.map((star) => (
					<motion.div
						key={star.id}
						className="absolute size-0.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.4)]"
						style={{ top: star.top, left: star.left }}
						animate={{ opacity: [0.1, 0.4, 0.1] }}
						transition={{
							duration: star.duration,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					/>
				))}
			</motion.div>

			{/* LAYER 3: Foreground Dust (Fastest) */}
			<motion.div
				style={{ x: fgDustX, y: fgDustY, translateZ: 0 }}
				className="absolute inset-[-25%] z-20 pointer-events-none opacity-20 will-change-transform"
			>
				{stars.fg.map((star) => (
					<motion.div
						key={star.id}
						className="absolute size-px bg-white shadow-[0_0_6px_white]"
						style={{ top: star.top, left: star.left }}
						animate={{ y: [0, -80], opacity: [0, 0.6, 0] }}
						transition={{
							duration: star.duration,
							repeat: Infinity,
							ease: "linear",
						}}
					/>
				))}
			</motion.div>

			{/* --- STATIC INTERFACE (STAYS FIXED) --- */}

			<div className="relative z-10 flex flex-col items-center gap-10">
				<div className="relative flex items-center justify-center">
					{/* Compact Orbit Ring (Static but rotating) */}
					<motion.div
						animate={{ rotate: 360, scale: [1, 1.03, 1] }}
						transition={{
							rotate: { duration: 30, repeat: Infinity, ease: "linear" },
							scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
						}}
						className="absolute size-[16rem] rounded-full border border-white/[0.06] sm:size-[22rem]"
					>
						<div className="absolute -top-1 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-white/10" />
					</motion.div>

					<div className="relative">
						<motion.h1
							animate={{ opacity: [0.95, 1, 0.95] }}
							transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
							className="text-[8rem] font-black leading-none tracking-tighter text-white sm:text-[14rem] drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]"
						>
							404
						</motion.h1>
					</div>

					<div className="absolute bottom-0 flex flex-col items-center translate-y-6 sm:translate-y-10">
						<div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 backdrop-blur-md">
							<Target className="size-3 text-white/40 animate-pulse" />
							<span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">
								Location Lost
							</span>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-8 pt-6 text-white">
					<div className="flex flex-col gap-2">
						<h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
							Signal Lost.
						</h2>
						<p className="max-w-[380px] text-white/30 text-xs sm:text-base font-light leading-relaxed tracking-wide">
							The requested resource has drifted beyond our event horizon.
						</p>
					</div>

					<div className="flex items-center justify-center">
						<Link
							to="/"
							onClick={triggerTap}
							className="group relative flex h-12 items-center gap-3 rounded-xl bg-white px-8 text-[11px] font-extrabold uppercase tracking-[0.2em] text-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
						>
							<Home className="size-3.5" />
							Initiate Homecoming
						</Link>
					</div>
				</div>
			</div>

			{/* STATIC FOOTER (System UI) */}
			<div className="absolute bottom-10 left-0 right-0 flex justify-center px-4 pointer-events-none z-40">
				<div className="flex items-center gap-4 font-mono text-[9px] uppercase tracking-[0.5em] text-white/40">
					<span className="relative flex size-1.5 items-center justify-center">
						<span className="absolute size-full rounded-full bg-white/10 animate-ping" />
						<span className="size-1 rounded-full bg-white/30" />
					</span>
					System_Offline | Deep_Space_Sector | Error_404
				</div>
			</div>
		</div>
	);
}
