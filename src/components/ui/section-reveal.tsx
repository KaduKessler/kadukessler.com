import {
	Children,
	type CSSProperties,
	cloneElement,
	createContext,
	isValidElement,
	type ReactElement,
	type ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * CSS-only replacement for the framer-motion scroll-reveal wrappers this
 * file used to export. Same visual result (fade + blur + scale-in on
 * first scroll into view, staggered for list items), zero motion library
 * cost: no vendor chunk, no per-instance animation object setup, just an
 * IntersectionObserver flipping a class.
 */

function useInView(amount: number) {
	const ref = useRef<HTMLDivElement>(null);
	const [inView, setInView] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setInView(true);
					observer.disconnect();
				}
			},
			{ threshold: amount },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [amount]);

	return { ref, inView };
}

type SectionRevealProps = {
	children: ReactNode;
	className?: string;
	delay?: number;
	/** Skip the entrance animation for content already in the first
	 * viewport, so it doesn't sit invisible waiting on the observer and
	 * cost LCP. */
	immediate?: boolean;
};

type StaggerProps = {
	children: ReactNode;
	className?: string;
	delay?: number;
	stagger?: number;
	immediate?: boolean;
};

type StaggerItemProps = {
	children: ReactNode;
	className?: string;
	immediate?: boolean;
};

export function SectionReveal({
	children,
	className,
	delay = 0,
	immediate = false,
}: SectionRevealProps) {
	const reduced = usePrefersReducedMotion();
	const { ref, inView } = useInView(0.1);

	if (reduced || immediate) {
		return <div className={className}>{children}</div>;
	}

	const style: CSSProperties = {
		opacity: inView ? 1 : 0,
		transform: inView ? "scale(1)" : "scale(0.985)",
		filter: inView ? "blur(0px)" : "blur(6px)",
		transitionDelay: `${delay}s`,
	};

	return (
		<div
			ref={ref}
			className={cn(
				className,
				"[transition:opacity_0.45s_ease-out,transform_0.45s_ease-out,filter_0.45s_ease-out]",
			)}
			style={style}
		>
			{children}
		</div>
	);
}

const StaggerContext = createContext<{
	inView: boolean;
	stagger: number;
	baseDelay: number;
} | null>(null);

export function Stagger({
	children,
	className,
	delay = 0,
	stagger = 0.06,
	immediate = false,
}: StaggerProps) {
	const reduced = usePrefersReducedMotion();
	const { ref, inView } = useInView(0.1);

	if (reduced || immediate) {
		return <div className={className}>{children}</div>;
	}

	return (
		<div ref={ref} className={className}>
			<StaggerContext.Provider value={{ inView, stagger, baseDelay: delay }}>
				{Children.map(children, (child, index) =>
					isValidElement(child)
						? cloneElement(child as ReactElement<{ index?: number }>, {
								index,
							})
						: child,
				)}
			</StaggerContext.Provider>
		</div>
	);
}

export function StaggerItem({
	children,
	className,
	immediate = false,
	index = 0,
}: StaggerItemProps & { index?: number }) {
	const reduced = usePrefersReducedMotion();
	const ctx = useContext(StaggerContext);

	if (reduced || immediate || !ctx) {
		return <div className={className}>{children}</div>;
	}

	const totalDelay = ctx.baseDelay + index * ctx.stagger;
	const style: CSSProperties = {
		opacity: ctx.inView ? 1 : 0,
		transform: ctx.inView ? "scale(1)" : "scale(0.99)",
		transitionDelay: `${totalDelay}s`,
	};

	return (
		<div
			className={cn(
				className,
				"[transition:opacity_0.4s_ease-out,transform_0.4s_ease-out]",
			)}
			style={style}
		>
			{children}
		</div>
	);
}
