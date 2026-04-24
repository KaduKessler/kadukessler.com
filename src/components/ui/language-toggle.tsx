import { Languages } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useTouchHaptics } from "@/lib/use-touch-haptics";

export function LanguageToggle() {
	const { i18n } = useTranslation();
	const { triggerTap } = useTouchHaptics();

	const toggleLanguage = () => {
		triggerTap?.();
		const nextLang = i18n.language.startsWith("en") ? "pt" : "en";
		i18n.changeLanguage(nextLang);
	};

	const currentLang = i18n.language.startsWith("en") ? "EN" : "PT";

	return (
		<button
			type="button"
			onClick={toggleLanguage}
			className="group relative flex h-8 min-w-14 cursor-pointer items-center justify-between rounded-lg px-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95 border border-transparent hover:border-border/40"
			aria-label="Toggle language"
		>
			<Languages className="size-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
			<div className="relative h-4 w-6 overflow-hidden">
				<motion.span
					key={currentLang}
					initial={{ y: 10, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: -10, opacity: 0 }}
					transition={{ type: "spring", damping: 20, stiffness: 300 }}
					className="absolute inset-0 flex items-center justify-end text-[10px] font-bold tracking-tighter"
				>
					{currentLang}
				</motion.span>
			</div>
		</button>
	);
}
