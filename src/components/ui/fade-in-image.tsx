import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function FadeInImage({
	src,
	alt,
	containerClassName = "min-h-[220px]",
	imgClassName,
	priority = false,
}: {
	src: string;
	alt: string;
	containerClassName?: string;
	imgClassName?: string;
	priority?: boolean;
}) {
	const [loaded, setLoaded] = useState(false);
	const visible = priority || loaded;

	return (
		<div className={cn("relative w-full", containerClassName)}>
			{/* Always mounted (visibility toggled via class, not conditional
			render): the prerender snapshot (scripts/prerender.mjs) captures
			the page after the real image has already loaded, so a client-only
			`{!loaded && <Skeleton />}` bakes in two different DOM shapes
			(skeleton present vs. absent) depending on prerender timing —
			a guaranteed hydration mismatch on every fresh mount, since
			hydration always starts from `loaded: false`. */}
			<Skeleton
				className={cn(
					"prerender-skeleton absolute inset-0 rounded-none transition-opacity duration-300 ease-out",
					visible ? "pointer-events-none opacity-0" : "opacity-100",
				)}
			/>
			<img
				src={src}
				alt={alt}
				loading={priority ? "eager" : "lazy"}
				fetchPriority={priority ? "high" : undefined}
				onLoad={() => setLoaded(true)}
				className={cn(
					imgClassName,
					"prerender-image transition-[opacity,transform] duration-300 ease-out",
					visible ? "scale-100 opacity-100" : "scale-105 opacity-0",
				)}
			/>
		</div>
	);
}
