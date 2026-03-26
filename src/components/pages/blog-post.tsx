import { ArrowLeft, Calendar, Clock3 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import remarkGfm from "remark-gfm";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getPostBySlug } from "@/lib/blog";
import { useTouchHaptics } from "@/lib/use-touch-haptics";

export function BlogPost() {
	const { triggerTap } = useTouchHaptics();
	const { slug } = useParams<{ slug: string }>();
	const post = slug ? getPostBySlug(slug) : null;

	if (!post) {
		return (
			<main className="relative mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-8 px-4 pt-24 pb-16 sm:px-6 sm:pt-28">
				<header className="flex items-center justify-between rounded-2xl border border-border bg-card/50 px-4 py-3 backdrop-blur-sm">
					<Link
						to="/blog"
						onClick={triggerTap}
						className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
					>
						<ArrowLeft className="size-3.5" />
						Voltar para Blog
					</Link>
					<ThemeToggle />
				</header>

				<section className="rounded-2xl border border-dashed border-border bg-card/30 p-6">
					<h1 className="text-2xl font-semibold tracking-tight">
						Post nao encontrado
					</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						Esse slug nao existe ou foi removido.
					</p>
				</section>
			</main>
		);
	}

	return (
		<main className="relative mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-8 px-4 pt-24 pb-16 sm:px-6 sm:pt-28">
			<header className="flex items-center justify-between rounded-2xl border border-border bg-card/50 px-4 py-3 backdrop-blur-sm">
				<Link
					to="/blog"
					onClick={triggerTap}
					className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
				>
					<ArrowLeft className="size-3.5" />
					Voltar para Blog
				</Link>
				<ThemeToggle />
			</header>

			<article className="space-y-6">
				<div className="space-y-3">
					<p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
						Post
					</p>
					<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
						{post.title}
					</h1>
					<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
						<span className="inline-flex items-center gap-1.5">
							<Calendar className="size-3.5" />
							{new Intl.DateTimeFormat("pt-BR", {
								dateStyle: "long",
							}).format(new Date(post.publishedAt))}
						</span>
						<span className="inline-flex items-center gap-1.5">
							<Clock3 className="size-3.5" />
							{post.readingTimeMinutes} min de leitura
						</span>
					</div>
					{post.tags.length > 0 ? (
						<div className="flex flex-wrap gap-2">
							{post.tags.map((tag) => (
								<span
									key={`${post.slug}-${tag}`}
									className="rounded-full border border-border bg-card/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
								>
									#{tag}
								</span>
							))}
						</div>
					) : null}
				</div>

				{post.cover ? (
					<img
						src={post.cover}
						alt={post.title}
						className="h-auto w-full rounded-2xl border border-border object-cover"
					/>
				) : null}

				<div className="blog-markdown rounded-2xl border border-border bg-card/30 p-5 sm:p-7">
					<ReactMarkdown remarkPlugins={[remarkGfm]}>
						{post.content}
					</ReactMarkdown>
				</div>
			</article>
		</main>
	);
}
