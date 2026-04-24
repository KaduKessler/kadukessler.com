import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

/**
 * Componente que anima a transição de texto quando o idioma muda.
 * Aplica um efeito de fade + blur sutil.
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

	return (
		<AnimatePresence mode="wait">
			<motion.span
				key={i18n.language}
				initial={{ opacity: 0, filter: "blur(4px)", y: 2 }}
				animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
				exit={{ opacity: 0, filter: "blur(4px)", y: -2 }}
				transition={{ duration: 0.2, ease: "easeOut" }}
				className={className}
				style={{ display: inline ? "inline-block" : "block" }}
			>
				{children}
			</motion.span>
		</AnimatePresence>
	);
}
