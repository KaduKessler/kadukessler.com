import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useTouchHaptics } from "@/lib/use-touch-haptics";

export function ScrollProgress() {
	const { scrollYProgress } = useScroll();
	const scaleX = useSpring(scrollYProgress, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001,
	});

	return (
		<motion.div
			className="fixed top-0 left-0 right-0 z-60 h-0.5 origin-left bg-foreground/30"
			style={{ scaleX }}
		/>
	);
}

export function BackToTop() {
	const { triggerTap } = useTouchHaptics();
	const [isVisible, setIsVisible] = useState(false);
	const { scrollY } = useScroll();

	useEffect(() => {
		return scrollY.on("change", (latest) => {
			setIsVisible(latest > 400);
		});
	}, [scrollY]);

	const scrollToTop = () => {
		triggerTap?.();
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.button
					initial={{ opacity: 0, y: 20, scale: 0.8 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: 20, scale: 0.8 }}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={scrollToTop}
					className="fixed right-6 bottom-6 z-40 flex size-10 items-center justify-center rounded-full border border-border bg-background/60 text-muted-foreground backdrop-blur-md transition-colors hover:border-foreground/20 hover:text-foreground"
					aria-label="Back to top"
				>
					<ArrowUp className="size-4" />
				</motion.button>
			)}
		</AnimatePresence>
	);
}
