import {
	ArrowUp,
	Calendar,
	Check,
	ChevronLeft,
	ChevronRight,
	Clock3,
	Copy,
	Home,
	Share2,
	Tag,
	X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Footer } from "@/components/sections/footer";
import { LanguageReveal } from "@/components/ui/language-reveal";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { MDXContent } from "@/components/ui/mdx-content";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useToast } from "@/components/ui/toast";
import { getPostBySlug } from "@/lib/blog";

// Import standard GitHub Dark theme for code
import "highlight.js/styles/github-dark.css";

// --- LIGHTBOX COMPONENT ---
const Lightbox = ({
	images,
	initialIndex,
	onClose,
}: {
	images: { src: string; alt?: string }[];
	initialIndex: number;
	onClose: () => void;
}) => {
	const [currentIndex, setCurrentIndex] = useState(initialIndex);

	const next = useCallback(
		(e?: React.MouseEvent) => {
			e?.stopPropagation();
			setCurrentIndex((prev) => (prev + 1) % images.length);
		},
		[images.length],
	);

	const prev = useCallback(
		(e?: React.MouseEvent) => {
			e?.stopPropagation();
			setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
		},
		[images.length],
	);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
			if (e.key === "ArrowRight") next();
			if (e.key === "ArrowLeft") prev();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [onClose, next, prev]);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			onClick={onClose}
			className="fixed inset-0 z-1000 flex items-center justify-center bg-background/98 backdrop-blur-2xl p-4 sm:p-10 cursor-zoom-out"
		>
			<motion.button
				type="button"
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				className="absolute top-6 right-6 p-3 rounded-full bg-muted/20 hover:bg-muted/40 transition-colors z-1010"
				onClick={onClose}
			>
				<X className="size-6" />
			</motion.button>

			{images.length > 1 && (
				<>
					<button
						type="button"
						onClick={prev}
						className="absolute left-6 p-4 rounded-full bg-muted/10 hover:bg-muted/30 transition-all z-1010 hidden sm:block"
					>
						<ChevronLeft className="size-8" />
					</button>
					<button
						type="button"
						onClick={next}
						className="absolute right-6 p-4 rounded-full bg-muted/10 hover:bg-muted/30 transition-all z-1010 hidden sm:block"
					>
						<ChevronRight className="size-8" />
					</button>
				</>
			)}

			<div className="relative w-full h-full flex items-center justify-center pointer-events-none">
				<AnimatePresence mode="wait">
					<motion.img
						key={currentIndex}
						initial={{ scale: 0.95, opacity: 0, x: 20 }}
						animate={{ scale: 1, opacity: 1, x: 0 }}
						exit={{ scale: 0.95, opacity: 0, x: -20 }}
						transition={{ type: "spring", damping: 30, stiffness: 300 }}
						src={images[currentIndex].src}
						alt={images[currentIndex].alt}
						className="max-w-full max-h-full object-contain rounded-lg shadow-2xl select-none pointer-events-auto cursor-default"
						onClick={(e) => e.stopPropagation()}
					/>
				</AnimatePresence>
			</div>

			<div className="absolute bottom-10 left-0 w-full flex flex-col items-center gap-4 px-6">
				{images[currentIndex].alt && (
					<motion.p
						key={`alt-${currentIndex}`}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-sm text-foreground/90 font-medium text-center max-w-2xl px-4 py-2 rounded-lg bg-background/55 backdrop-blur-md border border-white/10 shadow-lg"
					>
						{images[currentIndex].alt}
					</motion.p>
				)}
				{images.length > 1 && (
					<div className="text-[11px] font-mono font-bold tracking-[0.25em] text-foreground/70 bg-background/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-sm mb-4">
						{currentIndex + 1} / {images.length}
					</div>
				)}
			</div>
		</motion.div>
	);
};

// --- CAROUSEL COMPONENT ---
const ImageCarousel = ({
	images,
	onImageClick,
}: {
	images: { src: string; alt?: string }[];
	onImageClick?: (
		images: { src: string; alt?: string }[],
		index: number,
	) => void;
}) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [loadedIndices, setLoadedIndices] = useState<Set<number>>(new Set());

	const next = useCallback(() => {
		setCurrentIndex((prev) => (prev + 1) % images.length);
	}, [images.length]);

	const prev = useCallback(() => {
		setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
	}, [images.length]);

	const markAsLoaded = (index: number) => {
		setLoadedIndices((prev) => new Set(prev).add(index));
	};

	return (
		<div className="my-12 rounded-[2rem] overflow-hidden border border-border/40 bg-muted/5 relative aspect-video group/carousel shadow-2xl">
			{/* All images pre-rendered to keep them loaded */}
			{images.map((img, idx) => (
				<div
					key={img.src}
					className={`absolute inset-0 transition-all duration-700 ease-out-expo ${
						idx === currentIndex
							? "opacity-100 z-10 scale-100"
							: "opacity-0 z-0 scale-105 pointer-events-none"
					}`}
				>
					{!loadedIndices.has(idx) && idx === currentIndex && (
						<Skeleton className="absolute inset-0 z-0 rounded-none h-full w-full" />
					)}
					<img
						src={img.src}
						alt={img.alt}
						onLoad={() => markAsLoaded(idx)}
						className="w-full h-full object-cover cursor-zoom-in"
					/>
					<button
						type="button"
						onClick={() => onImageClick?.(images, idx)}
						className="absolute inset-0 z-10"
						aria-label={img.alt ? `Open image: ${img.alt}` : "Open image"}
					/>
				</div>
			))}

			{/* Controls */}
			{images.length > 1 && (
				<>
					<div className="absolute inset-y-0 left-0 flex items-center p-6 z-20">
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								prev();
							}}
							className="p-3 rounded-full bg-background/20 backdrop-blur-xl border border-white/10 hover:bg-background/60 transition-all opacity-0 group-hover/carousel:opacity-100 hover:scale-110 active:scale-90"
						>
							<ChevronLeft className="size-5" />
						</button>
					</div>
					<div className="absolute inset-y-0 right-0 flex items-center p-6 z-20">
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								next();
							}}
							className="p-3 rounded-full bg-background/20 backdrop-blur-xl border border-white/10 hover:bg-background/60 transition-all opacity-0 group-hover/carousel:opacity-100 hover:scale-110 active:scale-90"
						>
							<ChevronRight className="size-5" />
						</button>
					</div>
					<div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2.5 z-20 bg-background/30 backdrop-blur-xl px-4 py-2.5 rounded-full border border-white/10 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 shadow-lg">
						{images.map((img, idx) => (
							<button
								type="button"
								key={img.src}
								onClick={(e) => {
									e.stopPropagation();
									setCurrentIndex(idx);
								}}
								className={`size-1.5 rounded-full transition-all ${idx === currentIndex ? "bg-primary w-5" : "bg-primary/30"}`}
							/>
						))}
					</div>
				</>
			)}
		</div>
	);
};

// Separated component to isolate re-renders during scroll
const ReadingProgressBar = memo(() => {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		let ticking = false;
		const updateProgress = () => {
			const totalHeight =
				document.documentElement.scrollHeight - window.innerHeight;
			const currentProgress = (window.scrollY / totalHeight) * 100;
			setProgress(currentProgress);
			ticking = false;
		};

		const onScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(updateProgress);
				ticking = true;
			}
		};

		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<div className="fixed top-0 left-0 w-full h-0.5 z-200 bg-muted/10 pointer-events-none">
			<motion.div
				className="h-full bg-primary origin-left"
				style={{ scaleX: progress / 100 }}
			/>
		</div>
	);
});

ReadingProgressBar.displayName = "ReadingProgressBar";

// Helper to extract text from React children (needed for highlighted code)
const extractText = (children: React.ReactNode): string => {
	if (typeof children === "string") return children;
	if (Array.isArray(children)) return children.map(extractText).join("");
	// @ts-expect-error - accessing props of React element
	if (children?.props?.children) return extractText(children.props.children);
	return "";
};

const CodeBlock = memo(
	({
		children,
		className,
	}: {
		children: React.ReactNode;
		className?: string;
	}) => {
		const [copied, setCopied] = useState(false);
		const language = className?.replace("language-", "") || "text";

		const onCopy = () => {
			const text = extractText(children).replace(/\n$/, "");
			if (text) {
				navigator.clipboard.writeText(text);
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			}
		};

		return (
			<div className="group relative my-8 overflow-hidden rounded-xl border border-border/40 bg-[#0d1117] shadow-2xl">
				<div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-white/5">
					<div className="flex items-center gap-2">
						<div className="flex gap-1.5">
							<div className="size-2.5 rounded-full bg-[#ff5f56]/20 border border-[#ff5f56]/40" />
							<div className="size-2.5 rounded-full bg-[#ffbd2e]/20 border border-[#ffbd2e]/40" />
							<div className="size-2.5 rounded-full bg-[#27c93f]/20 border border-[#27c93f]/40" />
						</div>
						<span className="ml-3 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-muted-foreground/30">
							{language}
						</span>
					</div>
					<button
						type="button"
						onClick={onCopy}
						className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/40 hover:text-primary transition-colors"
					>
						{copied ? (
							<Check className="size-3 text-green-500" />
						) : (
							<Copy className="size-3" />
						)}
						{copied ? "Copied" : "Copy"}
					</button>
				</div>
				<pre className="m-0! p-5! overflow-x-auto custom-scrollbar font-mono text-[13px] leading-relaxed bg-transparent">
					<code className={`${className} bg-transparent! p-0!`}>
						{children}
					</code>
				</pre>
			</div>
		);
	},
);

CodeBlock.displayName = "CodeBlock";

type MdxImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
	onOpen?: (image: { src: string; alt?: string }) => void;
};

const MdxImage = ({ src, alt, onOpen }: MdxImageProps) => {
	const [isLoaded, setIsLoaded] = useState(false);
	const loadingText = alt || "Visualizing Content";

	if (!src) return null;

	return (
		<button
			type="button"
			className="my-12 w-full rounded-[1.5rem] overflow-hidden border border-border/40 shadow-xl bg-muted/3 relative min-h-50 flex items-center justify-center group/img cursor-zoom-in"
			onClick={() => onOpen?.({ src, alt })}
		>
			<AnimatePresence>
				{!isLoaded && (
					<motion.span
						key="skeleton-wrap"
						initial={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.6, ease: "easeInOut" }}
						className="absolute inset-0 z-0 h-full w-full"
					>
						<Skeleton className="h-full w-full rounded-none" />
						<span className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
							<span className="px-3 py-1 rounded-md bg-background/50 backdrop-blur-sm text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-foreground/80 line-clamp-2 shadow-sm">
								{loadingText}
							</span>
						</span>
					</motion.span>
				)}
			</AnimatePresence>

			<img
				src={src}
				alt={alt}
				onLoad={() => setIsLoaded(true)}
				className="relative z-10 w-full h-auto object-cover transition-all duration-700 group-hover/img:scale-[1.02]"
				style={{ opacity: isLoaded ? 1 : 0 }}
			/>

			{alt && (
				<motion.span
					initial={{ opacity: 0, y: 5 }}
					animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 5 }}
					transition={{ delay: 0.2, duration: 0.5 }}
					className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-fit px-4 py-2 text-center text-[12px] font-medium text-foreground/90 z-20 bg-background/40 backdrop-blur-xl rounded-full border border-white/10 shadow-lg [text-shadow:0_1px_2px_rgba(0,0,0,0.3)]"
				>
					{alt}
				</motion.span>
			)}
		</button>
	);
};

export function BlogPost() {
	const { t, i18n } = useTranslation();
	const { slug } = useParams();
	const navigate = useNavigate();
	const { showToast } = useToast();
	const [showScrollTop, setShowScrollTop] = useState(false);
	const [isSharing, setIsSharing] = useState(false);
	const [coverLoaded, setCoverLoaded] = useState(false);
	const [lightboxData, setLightboxData] = useState<{
		images: { src: string; alt?: string }[];
		index: number;
	} | null>(null);

	const post = useMemo(() => (slug ? getPostBySlug(slug) : null), [slug]);

	const mdxComponents = useMemo(
		() => ({
			pre: ({ children }: { children: React.ReactNode }) => <>{children}</>,
			code: ({
				children,
				className,
				...props
			}: {
				children: React.ReactNode;
				className?: string;
			}) => {
				const isInline = !className;
				return isInline ? (
					<code
						className="bg-muted px-1.5 py-0.5 rounded text-[13px] font-mono text-primary font-medium"
						{...props}
					>
						{children}
					</code>
				) : (
					<CodeBlock className={className}>{children}</CodeBlock>
				);
			},
			img: (props: React.ComponentProps<typeof MdxImage>) => (
				<MdxImage
					{...props}
					onOpen={(image) =>
						setLightboxData({
							images: [{ src: image.src, alt: image.alt }],
							index: 0,
						})
					}
				/>
			),
			a: ({
				children,
				href,
				...props
			}: {
				children?: React.ReactNode;
				href?: string;
				[key: string]: unknown;
			}) => {
				const isExternal = href?.startsWith("http");
				return (
					<a
						href={href}
						className="text-primary hover:text-foreground underline underline-offset-4 decoration-primary/30 hover:decoration-foreground transition-all duration-300 font-medium"
						target={isExternal ? "_blank" : undefined}
						rel={isExternal ? "noopener noreferrer" : undefined}
						{...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
					>
						{children}
					</a>
				);
			},
			ImageCarousel: (props: React.ComponentProps<typeof ImageCarousel>) => (
				<ImageCarousel
					{...props}
					onImageClick={(images, index) => setLightboxData({ images, index })}
				/>
			),
		}),
		[],
	);

	useEffect(() => {
		if (!post && slug) {
			navigate("/blog", { replace: true });
		}
		window.scrollTo(0, 0);

		const handleScroll = () => {
			setShowScrollTop(window.scrollY > 400);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [post, slug, navigate]);

	if (!post) return null;

	const handleShare = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: post.title,
					text: post.excerpt,
					url: window.location.href,
				});
			} catch (err) {
				if ((err as Error).name !== "AbortError") {
					copyToClipboard();
				}
			}
		} else {
			copyToClipboard();
		}
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(window.location.href);
		setIsSharing(true);
		showToast(t("common.copyEmail"));
		setTimeout(() => setIsSharing(false), 2000);
	};

	return (
		<div className="min-h-screen bg-background selection:bg-primary/10">
			<Helmet>
				<title>{post.title} — Kadu Kessler</title>
				<meta name="description" content={post.excerpt} />
				<link
					rel="canonical"
					href={`https://kadukessler.com/blog/${post.slug}`}
				/>

				{/* Open Graph / Facebook */}
				<meta property="og:type" content="article" />
				<meta
					property="og:url"
					content={`https://kadukessler.com/blog/${post.slug}`}
				/>
				<meta property="og:title" content={post.title} />
				<meta property="og:description" content={post.excerpt} />
				{post.cover && <meta property="og:image" content={post.cover} />}

				{/* Twitter */}
				<meta property="twitter:card" content="summary_large_image" />
				<meta
					property="twitter:url"
					content={`https://kadukessler.com/blog/${post.slug}`}
				/>
				<meta property="twitter:title" content={post.title} />
				<meta property="twitter:description" content={post.excerpt} />
				{post.cover && <meta property="twitter:image" content={post.cover} />}

				{/* JSON-LD Structured Data */}
				<script type="application/ld+json">
					{JSON.stringify({
						"@context": "https://schema.org",
						"@type": "BlogPosting",
						headline: post.title,
						description: post.excerpt,
						image: post.cover,
						datePublished: post.publishedAt,
						author: {
							"@type": "Person",
							name: "Kadu Kessler",
							url: "https://kadukessler.com",
						},
					})}
				</script>
			</Helmet>

			<ReadingProgressBar />

			<AnimatePresence>
				{lightboxData && (
					<Lightbox
						images={lightboxData.images}
						initialIndex={lightboxData.index}
						onClose={() => setLightboxData(null)}
					/>
				)}
			</AnimatePresence>

			<div className="container max-w-3xl mx-auto px-6 pt-10 pb-24 sm:pt-16">
				{/* Top Navigation */}
				<nav className="flex items-center justify-between mb-16 relative z-50">
					<div className="flex items-center gap-6">
						<SectionReveal delay={0}>
							<div className="flex items-center gap-3">
								<Link
									to="/"
									className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
									title={t("common.backHome")}
								>
									<Home className="size-4" />
								</Link>
								<div className="h-4 w-px bg-border/40" />
								<Link
									to="/blog"
									className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
								>
									<ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
									<LanguageReveal inline>{t("common.backFeed")}</LanguageReveal>
								</Link>
							</div>
						</SectionReveal>
					</div>

					<div className="flex items-center gap-3">
						<SectionReveal delay={0.1}>
							<button
								type="button"
								onClick={handleShare}
								className={`p-2 rounded-lg transition-all ${isSharing ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground"}`}
								title={t("common.shareStory")}
							>
								{isSharing ? (
									<Check className="size-4" />
								) : (
									<Share2 className="size-4" />
								)}
							</button>
						</SectionReveal>
						<SectionReveal delay={0.15}>
							<div className="flex items-center gap-1">
								<LanguageToggle />
								<ThemeToggle />
							</div>
						</SectionReveal>
					</div>
				</nav>

				<article>
					<SectionReveal>
						<header className="flex flex-col gap-6 mb-12">
							<div className="flex items-center gap-4 text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-muted-foreground/40">
								<span className="flex items-center gap-1.5">
									<Calendar className="size-3" />
									<LanguageReveal inline>
										{new Date(post.publishedAt)
											.toLocaleDateString(
												i18n.language.startsWith("pt") ? "pt-BR" : "en-US",
												{
													month: "short",
													day: "2-digit",
													year: "numeric",
												},
											)
											.toUpperCase()}
									</LanguageReveal>
								</span>
								<div className="size-1 rounded-full bg-border/60" />
								<span className="flex items-center gap-1.5 text-primary/50">
									<Clock3 className="size-3" />
									<LanguageReveal inline>
										{t("common.minRead", { count: post.readingTimeMinutes })}
									</LanguageReveal>
								</span>
							</div>

							<h1 className="text-4xl sm:text-6xl font-bold tracking-tighter text-foreground leading-[1.05] italic">
								{post.title}
							</h1>

							<p className="text-xl text-muted-foreground/70 leading-relaxed border-l border-primary/20 pl-6 italic">
								{post.excerpt}
							</p>

							{post.tags.length > 0 && (
								<div className="flex flex-wrap gap-3 mt-2">
									{post.tags.map((tag) => (
										<span
											key={tag}
											className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/40 bg-muted/20 text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground/60"
										>
											<Tag className="size-3" />
											{tag}
										</span>
									))}
								</div>
							)}
						</header>
					</SectionReveal>

					{post.cover && (
						<SectionReveal delay={0.1}>
							<button
								type="button"
								className="mb-16 rounded-[2rem] overflow-hidden border border-border/40 aspect-video shadow-2xl bg-muted/3 relative flex items-center justify-center group/cover cursor-zoom-in"
								onClick={() => {
									if (!post.cover) return;
									setLightboxData({
										images: [{ src: post.cover, alt: post.title }],
										index: 0,
									});
								}}
								aria-label={`Open cover image for ${post.title}`}
							>
								<AnimatePresence>
									{!coverLoaded && (
										<motion.span
											key="cover-skeleton"
											initial={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											transition={{ duration: 0.6, ease: "easeInOut" }}
											className="absolute inset-0 z-0 h-full w-full"
										>
											<Skeleton className="h-full w-full rounded-none" />
											<span className="absolute inset-0 flex items-center justify-center">
												<span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-primary/20 italic">
													Accessing Entry
												</span>
											</span>
										</motion.span>
									)}
								</AnimatePresence>
								<motion.img
									src={post.cover}
									alt={post.title}
									onLoad={() => setCoverLoaded(true)}
									initial={{ opacity: 0 }}
									animate={coverLoaded ? { opacity: 1 } : { opacity: 0 }}
									transition={{ duration: 0.8, ease: "linear" }}
									className="relative z-10 w-full h-full object-cover transition-transform duration-700 group-hover/cover:scale-[1.03]"
								/>
							</button>
						</SectionReveal>
					)}

					{/* Post Content */}
					<SectionReveal delay={0.2}>
						<div
							className="blog-markdown prose prose-neutral dark:prose-invert max-w-none 
							prose-headings:tracking-tighter prose-headings:italic
							prose-p:text-muted-foreground/90 prose-p:leading-relaxed
							prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0 prose-pre:border-none
							prose-code:before:content-none prose-code:after:content-none
						"
						>
							<MDXContent code={post.content} components={mdxComponents} />
						</div>
					</SectionReveal>

					{/* EDITORIAL Footer */}
					<SectionReveal delay={0.3}>
						<footer className="mt-32 pb-16 border-t border-border/5">
							<div className="flex flex-col gap-10 pt-16">
								<div className="flex flex-col gap-1.5">
									<p className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-muted-foreground/30">
										<LanguageReveal inline>
											{t("common.endOfEntry")}
										</LanguageReveal>
									</p>
									<div className="h-px w-8 bg-primary/20" />
								</div>

								<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-12">
									<Link
										to="/blog"
										className="group flex flex-col gap-3 max-w-fit"
									>
										<span className="text-4xl sm:text-6xl font-bold italic tracking-tighter text-foreground group-hover:text-primary transition-all duration-500 leading-none">
											<LanguageReveal inline>
												{t("common.exploreMore")}
											</LanguageReveal>
										</span>
										<p className="text-sm font-medium text-muted-foreground/40 group-hover:text-foreground transition-colors duration-500 italic">
											Kadu Kessler / Blog Feed
										</p>
									</Link>

									<Link
										to="/"
										className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/40 hover:text-foreground transition-all"
									>
										<LanguageReveal inline>{t("common.goHome")}</LanguageReveal>{" "}
										<Home className="size-3.5" />
									</Link>
								</div>
							</div>
						</footer>
					</SectionReveal>

					{/* GLOBAL Footer */}
					<Footer />
				</article>
			</div>

			{showScrollTop && (
				<button
					type="button"
					onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
					className="fixed bottom-10 right-10 p-3.5 rounded-full bg-primary text-primary-foreground shadow-2xl z-50 hover:scale-110 active:scale-95 transition-all animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300"
				>
					<ArrowUp className="size-5" />
				</button>
			)}
		</div>
	);
}
