import { Languages } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTouchHaptics } from "@/lib/use-touch-haptics";

export function LanguageToggle() {
	const { i18n } = useTranslation();
	const { triggerTap } = useTouchHaptics();
	const currentLang = i18n.language.startsWith("en") ? "EN" : "PT";
	const [entered, setEntered] = useState(true);
	const prevLang = useRef(currentLang);

	useEffect(() => {
		if (prevLang.current === currentLang) return;
		prevLang.current = currentLang;
		setEntered(false);
		const id = requestAnimationFrame(() => setEntered(true));
		return () => cancelAnimationFrame(id);
	}, [currentLang]);

	const toggleLanguage = () => {
		triggerTap?.();
		const nextLang = i18n.language.startsWith("en") ? "pt" : "en";
		i18n.changeLanguage(nextLang);
	};

	return (
		<button
			type="button"
			onClick={toggleLanguage}
			className="group relative flex h-8 min-w-14 cursor-pointer items-center justify-between rounded-lg px-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95 border border-transparent hover:border-border/40"
			aria-label={`Toggle language (${currentLang})`}
		>
			<Languages className="size-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
			<div className="relative h-4 w-6 overflow-hidden">
				<span
					style={{
						transform: `translateY(${entered ? 0 : 10}px)`,
						opacity: entered ? 1 : 0,
						transition: "transform 0.25s ease-out, opacity 0.2s ease-out",
					}}
					className="absolute inset-0 flex items-center justify-end text-[10px] font-bold tracking-tighter"
				>
					{currentLang}
				</span>
			</div>
		</button>
	);
}
