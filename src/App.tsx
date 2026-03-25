import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "@/components/pages/home";
import { NotFound } from "@/components/ui/not-found";
import { ToastProvider } from "@/components/ui/toast";

export default function App() {
	return (
		<ToastProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</ToastProvider>
	);
}
