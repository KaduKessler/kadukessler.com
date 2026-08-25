import { CheckCircle2 } from "lucide-react";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { useDelayedUnmount } from "@/lib/use-delayed-unmount";

type ToastContextType = {
	showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toast, setToast] = useState<string | null>(null);
	const isOpen = toast !== null;
	const mounted = useDelayedUnmount(isOpen, 200);
	const [entered, setEntered] = useState(false);

	useEffect(() => {
		if (!isOpen) {
			setEntered(false);
			return;
		}
		const id = requestAnimationFrame(() => setEntered(true));
		return () => cancelAnimationFrame(id);
	}, [isOpen]);

	const showToast = (message: string) => {
		setToast(message);
		setTimeout(() => setToast(null), 3000);
	};

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			{mounted && (
				<div className="fixed bottom-24 left-1/2 z-100 -translate-x-1/2 sm:bottom-12">
					<div
						style={{
							opacity: entered ? 1 : 0,
							transform: entered
								? "translateY(0) scale(1)"
								: "translateY(10px) scale(0.9)",
						}}
						className="flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-sm font-medium text-foreground shadow-lg backdrop-blur-md [transition:opacity_0.2s_ease-out,transform_0.2s_ease-out]"
					>
						<CheckCircle2 className="size-4 text-emerald-500" />
						{toast}
					</div>
				</div>
			)}
		</ToastContext.Provider>
	);
}

export const useToast = () => {
	const context = useContext(ToastContext);
	if (!context) throw new Error("useToast must be used within ToastProvider");
	return context;
};
