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
	if (rootElement.hasChildNodes()) {
		hydrateRoot(rootElement, <App />);
	} else {
		createRoot(rootElement).render(<App />);
	}

	// Dispara o evento de renderização após o React carregar para o Prerenderer
	setTimeout(() => {
		document.dispatchEvent(new Event("render-event"));
	}, 1000);
}
