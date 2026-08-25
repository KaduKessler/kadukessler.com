import { useEffect, useState } from "react";

/**
 * Keeps a conditionally-rendered element mounted for `duration` ms after
 * `isOpen` flips false, so a CSS exit transition has time to play before
 * the DOM node actually goes away. Vanilla-JS equivalent of what
 * AnimatePresence gives you for free.
 */
export function useDelayedUnmount(isOpen: boolean, duration: number) {
	const [shouldRender, setShouldRender] = useState(isOpen);

	useEffect(() => {
		if (isOpen) {
			setShouldRender(true);
			return;
		}
		const timer = window.setTimeout(() => setShouldRender(false), duration);
		return () => window.clearTimeout(timer);
	}, [isOpen, duration]);

	return shouldRender;
}
