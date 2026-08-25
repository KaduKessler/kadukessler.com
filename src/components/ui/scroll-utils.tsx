import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useDelayedUnmount } from "@/lib/use-delayed-unmount";
import { useTouchHaptics } from "@/lib/use-touch-haptics";

function useScrollYProgress() {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		let raf = 0;
		const update = () => {
			const scrollable =
				document.documentElement.scrollHeight - window.innerHeight;
			setProgress(scrollable > 0 ? window.scrollY / scrollable : 0);
		};
		const onScroll = () => {
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(update);
		};
		update();
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll);
		return () => {
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
			cancelAnimationFrame(raf);
		};
	}, []);

	return progress;
}

export function ScrollProgress() {
	const progress = useScrollYProgress();

	return (
		<div
			className="fixed top-0 left-0 right-0 z-60 h-0.5 origin-left bg-foreground/30"
			style={{
				transform: `scaleX(${progress})`,
				transition: "transform 0.1s linear",
			}}
		/>
	);
}

export function BackToTop() {
	const { triggerTap } = useTouchHaptics();
	const [isVisible, setIsVisible] = useState(false);
	const mounted = useDelayedUnmount(isVisible, 200);

	useEffect(() => {
		const onScroll = () => setIsVisible(window.scrollY > 400);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const scrollToTop = () => {
		triggerTap?.();
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	if (!mounted) return null;

	return (
		<div
			className="fixed right-6 bottom-6 z-40"
			style={{
				opacity: isVisible ? 1 : 0,
				transform: isVisible
					? "translateY(0) scale(1)"
					: "translateY(20px) scale(0.8)",
				transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
			}}
		>
			<button
				type="button"
				onClick={scrollToTop}
				className="flex size-10 items-center justify-center rounded-full border border-border bg-background/60 text-muted-foreground backdrop-blur-md transition-all hover:border-foreground/20 hover:text-foreground hover:scale-110 active:scale-90"
				aria-label="Back to top"
			>
				<ArrowUp className="size-4" />
			</button>
		</div>
	);
}
