import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./lib/i18n";

const rootElement = document.getElementById("root");

if (rootElement) {
	// Production dist/ ships pre-rendered HTML per route (see
	// scripts/prerender.mjs) so crawlers without JS see real content.
	// hydrateRoot reconciles against that instead of createRoot's
	// discard-and-rebuild, which was throwing the free paint away.
	//
	// Only "/" is pre-rendered (see the TEMPORARY note in prerender.mjs);
	// every other route is served the home HTML as an SPA fallback.
	// Hydrating that against a different page throws React error #418, and
	// its static canonical (the home URL) would conflict with the one the
	// route sets itself. So off the home route: drop both and render fresh.
	if (rootElement.hasChildNodes() && window.location.pathname === "/") {
		hydrateRoot(rootElement, <App />);
	} else {
		if (window.location.pathname !== "/") {
			rootElement.replaceChildren();
			document.head.querySelector("link[rel='canonical']")?.remove();
		}
		createRoot(rootElement).render(<App />);
	}

	// Dispara o evento de renderização após o React carregar para o Prerenderer
	setTimeout(() => {
		document.dispatchEvent(new Event("render-event"));
	}, 1000);
}
