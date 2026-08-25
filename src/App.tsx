import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "@/components/pages/home";
import { ToastProvider } from "@/components/ui/toast";
import { BLOG_ENABLED } from "@/lib/flags";
import { applyDetectedLanguage } from "@/lib/i18n";

// Lazy so the 404 page's parallax-starfield motion usage never loads on
// the routes people actually land on.
const NotFound = lazy(() =>
	import("@/components/ui/not-found").then((m) => ({ default: m.NotFound })),
);
const Blog = lazy(() =>
	import("@/components/pages/blog").then((m) => ({ default: m.Blog })),
);
const BlogPost = lazy(() =>
	import("@/components/pages/blog-post").then((m) => ({ default: m.BlogPost })),
);
const ProjectDetail = lazy(() =>
	import("@/components/pages/project-detail").then((m) => ({
		default: m.ProjectDetail,
	})),
);
const ProjectsPage = lazy(() =>
	import("@/components/pages/projects").then((m) => ({
		default: m.ProjectsPage,
	})),
);

export default function App() {
	useEffect(() => {
		applyDetectedLanguage();
	}, []);

	return (
		<ToastProvider>
			<BrowserRouter>
				<Routes>
					{/* No Suspense boundary here: Home is prerendered
					(scripts/prerender.mjs) and hydrated against that static
					snapshot. The snapshot is a plain client-rendered DOM (via
					puppeteer), which doesn't contain the comment-node markers
					React's Suspense boundaries need for hydration, so wrapping
					this route in Suspense throws a hydration-mismatch error on
					every single load. The other routes are lazy-loaded but never
					prerendered, so Suspense around them is safe. */}
					<Route path="/" element={<Home />} />
					<Route
						path="/projects"
						element={
							<Suspense fallback={null}>
								<ProjectsPage />
							</Suspense>
						}
					/>
					<Route
						path="/projects/:slug"
						element={
							<Suspense fallback={null}>
								<ProjectDetail />
							</Suspense>
						}
					/>
					{BLOG_ENABLED && (
						<>
							<Route
								path="/blog"
								element={
									<Suspense fallback={null}>
										<Blog />
									</Suspense>
								}
							/>
							<Route
								path="/blog/:slug"
								element={
									<Suspense fallback={null}>
										<BlogPost />
									</Suspense>
								}
							/>
						</>
					)}
					<Route
						path="*"
						element={
							<Suspense fallback={null}>
								<NotFound />
							</Suspense>
						}
					/>
				</Routes>
			</BrowserRouter>
		</ToastProvider>
	);
}
