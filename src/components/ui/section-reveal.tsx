import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionRevealProps = {
	children: ReactNode;
	className?: string;
	delay?: number;
};

type StaggerProps = {
	children: ReactNode;
	className?: string;
	delay?: number;
	stagger?: number;
};

type StaggerItemProps = {
	children: ReactNode;
	className?: string;
};

export function SectionReveal({
	children,
	className,
	delay = 0,
}: SectionRevealProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return <div className={className}>{children}</div>;
	}

	return (
		<motion.div
			className={className}
			initial={{ opacity: 0, scale: 0.985, filter: "blur(6px)" }}
			whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
			viewport={{ once: true, amount: 0.2 }}
			transition={{ duration: 0.45, ease: "easeOut", delay }}
		>
			{children}
		</motion.div>
	);
}

export function Stagger({
	children,
	className,
	delay = 0,
	stagger = 0.06,
}: StaggerProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return <div className={className}>{children}</div>;
	}

	return (
		<motion.div
			className={className}
			initial="hidden"
			whileInView="show"
			viewport={{ once: true, amount: 0.2 }}
			variants={{
				hidden: { opacity: 0, scale: 0.99 },
				show: {
					opacity: 1,
					scale: 1,
					transition: {
						duration: 0.4,
						ease: "easeOut",
						delay,
						staggerChildren: stagger,
					},
				},
			}}
		>
			{children}
		</motion.div>
	);
}

export function StaggerItem({ children, className }: StaggerItemProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return <div className={className}>{children}</div>;
	}

	return (
		<motion.div
			className={cn(className)}
			variants={{
				hidden: { opacity: 0, scale: 0.99 },
				show: { opacity: 1, scale: 1 },
			}}
		>
			{children}
		</motion.div>
	);
}
