import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export type LightboxImage = {
	src: string;
	alt?: string;
	variant?: "cover" | "logo";
};

function Lightbox({
	image,
	onClose,
}: {
	image: LightboxImage;
	onClose: () => void;
}) {
	const { t } = useTranslation();
	const closeRef = useRef<HTMLButtonElement>(null);

	// Move focus into the dialog and give it back to the trigger on close.
	useEffect(() => {
		const trigger = document.activeElement as HTMLElement | null;
		closeRef.current?.focus();
		return () => trigger?.focus();
	}, []);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
			// The close button is the only control: keep focus inside the dialog.
			if (e.key === "Tab") {
				e.preventDefault();
				closeRef.current?.focus();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [onClose]);

	return (
		<motion.div
			role="dialog"
			aria-modal="true"
			aria-label={image.alt || t("common.enlargedImage")}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			onClick={onClose}
			className="fixed inset-0 z-100 flex cursor-zoom-out items-center justify-center bg-background/95 p-4 backdrop-blur-sm sm:p-10"
		>
			<button
				ref={closeRef}
				type="button"
				onClick={onClose}
				className="absolute top-6 right-6 rounded-full border border-border bg-card p-2.5 text-muted-foreground transition-colors hover:text-foreground"
				aria-label={t("common.close")}
			>
				<X className="size-5" />
			</button>
			<motion.img
				initial={{ scale: 0.97, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.97, opacity: 0 }}
				transition={{ type: "spring", damping: 26, stiffness: 300 }}
				src={image.src}
				alt={image.alt ?? ""}
				className={cn(
					"cursor-default rounded-lg object-contain shadow-2xl",
					image.variant === "logo"
						? "max-h-40 max-w-64 sm:max-h-48 sm:max-w-80"
						: "max-h-full max-w-full",
				)}
				onClick={(e) => e.stopPropagation()}
			/>
			{image.alt && (
				<motion.p
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 8 }}
					className="absolute bottom-8 left-1/2 max-w-xl -translate-x-1/2 rounded-full border border-border bg-card/90 px-4 py-2 text-center text-xs text-muted-foreground backdrop-blur-md"
				>
					{image.alt}
				</motion.p>
			)}
		</motion.div>
	);
}

export function ProjectLightbox({
	image,
	onClose,
}: {
	image: LightboxImage | null;
	onClose: () => void;
}) {
	return (
		<AnimatePresence>
			{image && <Lightbox image={image} onClose={onClose} />}
		</AnimatePresence>
	);
}
