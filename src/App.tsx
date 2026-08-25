import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "@/components/pages/home";
import { ToastProvider } from "@/components/ui/toast";
import { BLOG_ENABLED } from "@/lib/flags";

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
	return (
		<ToastProvider>
			<BrowserRouter>
				<Suspense fallback={null}>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/projects" element={<ProjectsPage />} />
						<Route path="/projects/:slug" element={<ProjectDetail />} />
						{BLOG_ENABLED && (
							<>
								<Route path="/blog" element={<Blog />} />
								<Route path="/blog/:slug" element={<BlogPost />} />
							</>
						)}
						<Route path="*" element={<NotFound />} />
					</Routes>
				</Suspense>
			</BrowserRouter>
		</ToastProvider>
	);
}
