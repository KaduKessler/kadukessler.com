import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root");

if (rootElement) {
	createRoot(rootElement).render(
		<HelmetProvider>
			<App />
		</HelmetProvider>,
	);

	// Dispara o evento de renderização após o React carregar para o Prerenderer
	setTimeout(() => {
		document.dispatchEvent(new Event("render-event"));
	}, 1000);
}
