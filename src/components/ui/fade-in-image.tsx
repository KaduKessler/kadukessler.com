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
			{!loaded && <Skeleton className="absolute inset-0 rounded-none" />}
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
