import {
	ArrowUp,
	Calendar,
	Check,
	ChevronLeft,
	Clock3,
	Copy,
	Home,
	Share2,
	Tag,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { SectionReveal } from "@/components/ui/section-reveal";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useToast } from "@/components/ui/toast";
import { getPostBySlug } from "@/lib/blog";

// Import standard GitHub Dark theme for code
import "highlight.js/styles/github-dark.css";

// Helper to extract text from React children (needed for highlighted code)
const extractText = (children: React.ReactNode): string => {
	if (typeof children === "string") return children;
	if (Array.isArray(children)) return children.map(extractText).join("");
	// @ts-expect-error - accessing props of React element
	if (children?.props?.children) return extractText(children.props.children);
	return "";
};

const CodeBlock = ({
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
				<code className={`${className} bg-transparent! p-0!`}>{children}</code>
			</pre>
		</div>
	);
};

const mdxComponents = {
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
	img: ({
		src,
		alt,
		...props
	}: {
		src?: string;
		alt?: string;
		[key: string]: unknown;
	}) => (
		<span className="block my-12 rounded-[1.5rem] overflow-hidden border border-border/40 shadow-xl bg-muted/10">
			<img
				src={src}
				alt={alt}
				className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-500"
				{...(props as React.ImgHTMLAttributes<HTMLImageElement>)}
			/>
			{alt && (
				<span className="block p-3 text-center text-xs text-muted-foreground italic border-t border-border/10 bg-card/20 font-medium">
					{alt}
				</span>
			)}
		</span>
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
};

export function BlogPost() {
	const { slug } = useParams();
	const navigate = useNavigate();
	const { showToast } = useToast();
	const [scrollProgress, setScrollProgress] = useState(0);
	const [showScrollTop, setShowScrollUp] = useState(false);
	const [isSharing, setIsSharing] = useState(false);

	const post = useMemo(() => (slug ? getPostBySlug(slug) : null), [slug]);

	useEffect(() => {
		if (!post && slug) {
			navigate("/blog", { replace: true });
		}
		window.scrollTo(0, 0);

		const handleScroll = () => {
			const totalHeight =
				document.documentElement.scrollHeight - window.innerHeight;
			const progress = (window.scrollY / totalHeight) * 100;
			setScrollProgress(progress);
			setShowScrollUp(window.scrollY > 400);
		};

		window.addEventListener("scroll", handleScroll);
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
		showToast("Link copied to clipboard!");
		setTimeout(() => setIsSharing(false), 2000);
	};

	const { Content } = post;

	return (
		<div className="min-h-screen bg-background selection:bg-primary/10">
			{/* Reading Progress */}
			<div className="fixed top-0 left-0 w-full h-0.5 z-100 bg-muted/10">
				<div
					className="h-full bg-primary transition-all duration-150 ease-out"
					style={{ width: `${scrollProgress}%` }}
				/>
			</div>

			<div className="container max-w-3xl mx-auto px-6 pt-10 pb-24 sm:pt-16">
				{/* Top Navigation */}
				<nav className="flex items-center justify-between mb-16 relative z-50">
					<div className="flex items-center gap-6">
						<SectionReveal>
							<Link
								to="/"
								className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
								title="Back to Home"
							>
								<Home className="size-4" />
								<span className="hidden sm:inline">Home</span>
							</Link>
						</SectionReveal>
						<SectionReveal delay={0.05}>
							<Link
								to="/blog"
								className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
							>
								<ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
								<span>Feed</span>
							</Link>
						</SectionReveal>
					</div>

					<div className="flex items-center gap-3">
						<SectionReveal delay={0.1}>
							<button
								type="button"
								onClick={handleShare}
								className={`p-2 rounded-lg transition-all ${isSharing ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground"}`}
								title="Share story"
							>
								{isSharing ? (
									<Check className="size-4" />
								) : (
									<Share2 className="size-4" />
								)}
							</button>
						</SectionReveal>
						<SectionReveal delay={0.15}>
							<ThemeToggle />
						</SectionReveal>
					</div>
				</nav>

				<article>
					<SectionReveal>
						<header className="flex flex-col gap-6 mb-12">
							<div className="flex items-center gap-4 text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-muted-foreground/40">
								<span className="flex items-center gap-1.5">
									<Calendar className="size-3" />
									{new Date(post.publishedAt)
										.toLocaleDateString("en-US", {
											month: "short",
											day: "2-digit",
											year: "numeric",
										})
										.toUpperCase()}
								</span>
								<div className="size-1 rounded-full bg-border/60" />
								<span className="flex items-center gap-1.5 text-primary/50">
									<Clock3 className="size-3" />
									{post.readingTimeMinutes} MIN READ
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
							<div className="mb-16 rounded-[2rem] overflow-hidden border border-border/40 aspect-video shadow-2xl bg-muted/20">
								<img
									src={post.cover}
									alt={post.title}
									className="w-full h-full object-cover"
								/>
							</div>
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
							<Content components={mdxComponents} />
						</div>
					</SectionReveal>

					{/* ZEN Footer */}
					<SectionReveal delay={0.3}>
						<footer className="mt-24 pt-12 border-t border-border/10 flex flex-col gap-12">
							<div className="flex flex-col gap-2 items-center text-center">
								<p className="text-sm font-medium italic text-muted-foreground/40">
									Thanks for being here.
								</p>
							</div>

							<div className="flex items-center justify-center gap-8">
								<Link
									to="/blog"
									className="group flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary transition-colors"
								>
									<ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
									Back to Feed
								</Link>
								<div className="size-1 rounded-full bg-border/40" />
								<Link
									to="/"
									className="group flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary transition-colors"
								>
									<Home className="size-4" />
									Home
								</Link>
							</div>
						</footer>
					</SectionReveal>
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
