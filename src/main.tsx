import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./lib/i18n";

async function start() {
	const rootElement = document.getElementById("root");
	if (!rootElement) return;

	const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
	// React takes ownership of the metadata embedded in the HTTP snapshot.
	if (
		pathname === "/" ||
		pathname === "/projects" ||
		pathname.startsWith("/projects/")
	) {
		document.head
			.querySelectorAll(
				"title, meta[name='description'], link[rel='canonical'], meta[property^='og:'], meta[property^='twitter:']",
			)
			.forEach((element) => {
				element.remove();
			});
	}
	const initialHome =
		pathname === "/"
			? (await import("./components/pages/home")).Home
			: undefined;
	const initialProjectsPage =
		pathname === "/projects"
			? (await import("./components/pages/projects")).ProjectsPage
			: undefined;
	const initialProjectDetail = pathname.startsWith("/projects/")
		? (await import("./components/pages/project-detail")).ProjectDetail
		: undefined;
	const app = (
		<App
			initialHome={initialHome}
			initialProjectsPage={initialProjectsPage}
			initialProjectDetail={initialProjectDetail}
		/>
	);

	if (
		rootElement.hasChildNodes() &&
		rootElement.dataset.prerenderPath === pathname
	) {
		hydrateRoot(rootElement, app);
	} else {
		rootElement.replaceChildren();
		document.head.querySelector("link[rel='canonical']")?.remove();
		createRoot(rootElement).render(app);
	}
}

void start();
