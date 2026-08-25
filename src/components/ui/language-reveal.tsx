import { type ReactNode, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * CSS-only replacement for the framer-motion crossfade this used to do.
 * Simplified from a true exit/enter overlap to a single fade-in of the
 * new text (no second DOM node kept alive during exit) — same blur/offset
 * language as the rest of the site's entrance animations, without
 * pulling framer-motion into every text block on the page.
 */
export function LanguageReveal({
	children,
	className,
	inline = false,
}: {
	children: ReactNode;
	className?: string;
	inline?: boolean;
}) {
	const { i18n } = useTranslation();
	const [visible, setVisible] = useState(true);
	const prevLang = useRef(i18n.language);

	useEffect(() => {
		if (prevLang.current === i18n.language) return;
		prevLang.current = i18n.language;
		setVisible(false);
		const id = requestAnimationFrame(() => setVisible(true));
		return () => cancelAnimationFrame(id);
	}, [i18n.language]);

	return (
		<span
			className={className}
			style={{
				display: inline ? "inline-block" : "block",
				opacity: visible ? 1 : 0,
				filter: visible ? "blur(0px)" : "blur(4px)",
				transform: visible ? "translateY(0)" : "translateY(2px)",
				transition:
					"opacity 0.2s ease-out, filter 0.2s ease-out, transform 0.2s ease-out",
			}}
		>
			{children}
		</span>
	);
}
