import { CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { createContext, type ReactNode, useContext, useState } from "react";

type ToastContextType = {
	showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toast, setToast] = useState<string | null>(null);

	const showToast = (message: string) => {
		setToast(message);
		setTimeout(() => setToast(null), 3000);
	};

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			<AnimatePresence>
				{toast && (
					<div className="fixed bottom-24 left-1/2 z-100 -translate-x-1/2 sm:bottom-12">
						<motion.div
							initial={{ opacity: 0, y: 20, scale: 0.9 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 10, scale: 0.9 }}
							className="flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-sm font-medium text-foreground shadow-lg backdrop-blur-md"
						>
							<CheckCircle2 className="size-4 text-emerald-500" />
							{toast}
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</ToastContext.Provider>
	);
}

export const useToast = () => {
	const context = useContext(ToastContext);
	if (!context) throw new Error("useToast must be used within ToastProvider");
	return context;
};
