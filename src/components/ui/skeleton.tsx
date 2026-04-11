import { cn } from "@/lib/utils";

function Skeleton({
	className,
	...props
}: React.HTMLAttributes<HTMLSpanElement>) {
	return (
		<span
			className={cn(
				"block rounded-md bg-muted/10 overflow-hidden relative",
				className,
			)}
			{...props}
		>
			<span className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 animate-[pulse-organic_3s_ease-in-out_infinite]" />
		</span>
	);
}

export { Skeleton };
