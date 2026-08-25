import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTouchHaptics } from "@/lib/use-touch-haptics";

export function ThemeToggle() {
	const [theme, setTheme] = useState<"dark" | "light">(() => {
		if (typeof window !== "undefined") {
			return document.documentElement.classList.contains("dark")
				? "dark"
				: "light";
		}
		return "dark";
	});

	const { triggerTap } = useTouchHaptics();

	useEffect(() => {
		const root = window.document.documentElement;
		if (theme === "dark") {
			root.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			root.classList.remove("dark");
			localStorage.setItem("theme", "light");
		}
	}, [theme]);

	const toggleTheme = () => {
		triggerTap?.();

		if (!document.startViewTransition) {
			setTheme(theme === "dark" ? "light" : "dark");
			return;
		}

		document.startViewTransition(() => {
			setTheme(theme === "dark" ? "light" : "dark");
		});
	};

	return (
		<button
			type="button"
			onClick={toggleTheme}
			className="relative flex size-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-90"
			aria-label="Toggle theme"
		>
			<div
				style={{
					transform: `rotate(${theme === "dark" ? 0 : 90}deg) scale(${theme === "dark" ? 1 : 0})`,
					opacity: theme === "dark" ? 1 : 0,
					transition: "transform 0.25s ease-out, opacity 0.2s ease-out",
				}}
				className="absolute"
			>
				<Moon className="size-4" />
			</div>
			<div
				style={{
					transform: `rotate(${theme === "light" ? 0 : -90}deg) scale(${theme === "light" ? 1 : 0})`,
					opacity: theme === "light" ? 1 : 0,
					transition: "transform 0.25s ease-out, opacity 0.2s ease-out",
				}}
				className="absolute"
			>
				<Sun className="size-4" />
			</div>
		</button>
	);
}
