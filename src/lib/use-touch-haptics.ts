import { useCallback } from "react";
import { useWebHaptics } from "web-haptics/react";

function canUseTouchHaptics() {
	if (typeof window === "undefined") {
		return false;
	}

	const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;

	return hasCoarsePointer && !prefersReducedMotion;
}

export function useTouchHaptics() {
	const { trigger } = useWebHaptics();

	const triggerTap = useCallback(() => {
		if (!canUseTouchHaptics()) {
			return;
		}

		trigger([{ duration: 14, intensity: 0.4 }]);
	}, [trigger]);

	const triggerPrimaryAction = useCallback(() => {
		if (!canUseTouchHaptics()) {
			return;
		}

		trigger([
			{ duration: 18, intensity: 0.55 },
			{ delay: 35, duration: 14, intensity: 0.45 },
		]);
	}, [trigger]);

	return {
		triggerTap,
		triggerPrimaryAction,
	};
}
