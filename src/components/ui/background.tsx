export function Background() {
	return (
		<div
			aria-hidden="true"
			className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden"
		>
			<div className="absolute inset-0 [background-image:radial-gradient(circle,_oklch(0_0_0_/_0.07)_1px,_transparent_1px)] dark:[background-image:radial-gradient(circle,_oklch(1_0_0_/_0.08)_1px,_transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,_black_40%,_transparent_100%)]" />
		</div>
	);
}
