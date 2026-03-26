import { ArrowLeft, Calendar, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getAllPosts } from "@/lib/blog";
import { useTouchHaptics } from "@/lib/use-touch-haptics";

export function Blog() {
	const { triggerTap } = useTouchHaptics();
	const posts = getAllPosts();

	return (
		<main className="relative mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-10 px-4 pt-24 pb-16 sm:px-6 sm:pt-28">
			<header className="flex items-center justify-between rounded-2xl border border-border bg-card/50 px-4 py-3 backdrop-blur-sm">
				<Link
					to="/"
					onClick={triggerTap}
					className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
				>
					<ArrowLeft className="size-3.5" />
					Voltar para Home
				</Link>
				<ThemeToggle />
			</header>

			<section className="space-y-3">
				<p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
					Blog
				</p>
				<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
					Notas, aprendizados e experimentos
				</h1>
				<p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
					Espaco para compartilhar o que estou construindo, erros que valeram a
					pena e coisas novas que estou aprendendo no caminho.
				</p>
			</section>

			<section className="space-y-4">
				{posts.length === 0 ? (
					<div className="rounded-2xl border border-dashed border-border bg-card/30 p-6 text-sm text-muted-foreground">
						Sem posts publicados ainda.
					</div>
				) : (
					posts.map((post) => (
						<article
							key={post.slug}
							className="rounded-2xl border border-border bg-card/35 p-5 transition-colors hover:bg-card/60"
						>
							<Link
								to={`/blog/${post.slug}`}
								onClick={triggerTap}
								className="group block"
							>
								<h2 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-muted-foreground">
									{post.title}
								</h2>
								<p className="mt-2 text-sm text-muted-foreground">
									{post.excerpt}
								</p>
								<div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground/90">
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
									<div className="mt-4 flex flex-wrap gap-2">
										{post.tags.map((tag) => (
											<span
												key={`${post.slug}-${tag}`}
												className="rounded-full border border-border bg-background/70 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
											>
												#{tag}
											</span>
										))}
									</div>
								) : null}
							</Link>
						</article>
					))
				)}
			</section>
		</main>
	);
}
