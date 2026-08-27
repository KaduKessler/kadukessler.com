import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function FadeInImage({
	src,
	alt,
	containerClassName = "min-h-[220px]",
	imgClassName,
}: {
	src: string;
	alt: string;
	containerClassName?: string;
	imgClassName?: string;
}) {
	const [loaded, setLoaded] = useState(false);

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
					"absolute inset-0 rounded-none transition-opacity duration-300 ease-out",
					loaded ? "pointer-events-none opacity-0" : "opacity-100",
				)}
			/>
			<img
				src={src}
				alt={alt}
				loading="lazy"
				onLoad={() => setLoaded(true)}
				className={cn(
					imgClassName,
					"transition-all duration-300 ease-out",
					loaded ? "scale-100 opacity-100" : "scale-105 opacity-0",
				)}
			/>
		</div>
	);
}
