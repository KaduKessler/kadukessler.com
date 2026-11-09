import { type ComponentType, lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastProvider } from "@/components/ui/toast";
import { BLOG_ENABLED } from "@/lib/flags";
import { applyDetectedLanguage } from "@/lib/i18n";

// Lazy so the 404 page's parallax-starfield motion usage never loads on
// the routes people actually land on.
const NotFound = lazy(() =>
	import("@/components/ui/not-found").then((m) => ({ default: m.NotFound })),
);
const Home = lazy(() =>
	import("@/components/pages/home").then((m) => ({ default: m.Home })),
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

export default function App({
	initialHome: InitialHome,
	initialProjectsPage: InitialProjectsPage,
	initialProjectDetail: InitialProjectDetail,
}: {
	initialHome?: ComponentType;
	initialProjectsPage?: ComponentType;
	initialProjectDetail?: ComponentType;
}) {
	useEffect(() => {
		applyDetectedLanguage();
	}, []);

	return (
		<ToastProvider>
			<BrowserRouter>
				<Routes>
					{/* Initial prerendered routes render without Suspense: browser
					snapshots do not contain React's server Suspense markers. */}
					<Route
						path="/"
						element={
							InitialHome ? (
								<InitialHome />
							) : (
								<Suspense fallback={null}>
									<Home />
								</Suspense>
							)
						}
					/>
					<Route
						path="/projects"
						element={
							InitialProjectsPage ? (
								<InitialProjectsPage />
							) : (
								<Suspense fallback={null}>
									<ProjectsPage />
								</Suspense>
							)
						}
					/>
					<Route
						path="/projects/:slug"
						element={
							InitialProjectDetail ? (
								<InitialProjectDetail />
							) : (
								<Suspense fallback={null}>
									<ProjectDetail />
								</Suspense>
							)
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
