import { Button } from "@/components/ui/button";

export default function App() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-6">
			<h1 className="text-4xl font-bold tracking-tighter text-zinc-100">
				kadukessler.com
			</h1>
			<p className="mt-2 text-zinc-400">
				Em construção • Stack: React + Tailwind v4
			</p>
			<Button>shadcn/ui ativo</Button>

			{/* Teste de Card com o tema que definimos */}
			<div className="mt-8 p-6 rounded-2xl bg-card border border-border shadow-xl">
				<span className="text-xs uppercase tracking-widest text-zinc-500">
					Projeto Atual
				</span>
				<h2 className="text-xl font-medium mt-1">Refatoração do Portfólio</h2>
			</div>
		</div>
	);
}
