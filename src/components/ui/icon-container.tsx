import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type IconContainerProps = {
	children: ReactNode;
	className?: string;
	size?: "sm" | "md";
};

export function IconContainer({
	children,
	className,
	size = "md",
}: IconContainerProps) {
	return (
		<div
			className={cn(
				"flex shrink-0 items-center justify-center bg-background",
				size === "md" && "size-10 rounded-lg border border-border",
				size === "sm" && "size-7 rounded-md border border-border/60",
				className,
			)}
		>
			{children}
		</div>
	);
}
