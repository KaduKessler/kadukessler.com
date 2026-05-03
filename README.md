# kadukessler.com

Portfolio pessoal de Kadu Kessler, Full-Stack Developer focado em .NET e React.

## Stack

| Camada | Tecnologias |
|--------|-------------|
| UI | React 19, TypeScript, Tailwind CSS v4 |
| Animações | Motion (Framer Motion) |
| Roteamento | React Router v7 |
| i18n | i18next + react-i18next (PT / EN) |
| Blog | Velite (MDX + frontmatter) |
| Build | Vite 8 |
| Qualidade | Biome (lint + format) |
| Deploy | GitHub Actions + rsync + PM2 |

## Estrutura

```
src/
├── components/
│   ├── pages/          # Home, Blog, BlogPost
│   ├── sections/       # Hero, About, Experience, Education, Stack, Contact
│   └── ui/             # Background, IconContainer, FloatingNav, etc.
├── lib/                # i18n, utils, hooks
└── locales/            # pt.json, en.json
content/
└── blog/               # Posts em MDX
```

## Dev

```bash
pnpm install
pnpm dev        # Velite + Vite em paralelo (localhost:5173)
pnpm build      # Build de produção
pnpm preview    # Serve build localmente (localhost:4173)
```

## Qualidade de código

```bash
pnpm lint       # Biome check
pnpm format     # Biome format --write
```

CI roda `biome check` em todo push/PR para `main` via `.github/workflows/biome-lint.yml`.

## Deploy

Push para `main` dispara `.github/workflows/deploy.yml`:

1. GitHub Actions faz checkout, instala deps e roda `pnpm build`
2. `dist/` é sincronizado via rsync para servidor pessoal (SSH)
3. PM2 reinicia servindo o `dist/` em modo SPA no servidor

O `dist/404.html` é gerado como cópia de `index.html` para suportar client-side routing.
