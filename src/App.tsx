export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold tracking-tighter text-zinc-100">
        kadukessler.com
      </h1>
      <p className="mt-2 text-zinc-400">
        Em construção • Stack: React + Tailwind v4
      </p>
      
      {/* Teste de Card com o tema que definimos */}
      <div className="mt-8 p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-xl">
        <span className="text-xs uppercase tracking-widest text-zinc-500">Projeto Atual</span>
        <h2 className="text-xl font-medium mt-1">Refatoração do Portfólio</h2>
      </div>
    </div>
  )
}
