<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/images/kadu_logo_white.svg">
    <img src="public/images/kadu_logo.svg" alt="Kadu Kessler" width="72">
  </picture>

  # kadukessler.com

  Portfolio pessoal de **Kadu Kessler**, Full-Stack Developer focado em .NET e React.

  [![Deploy](https://github.com/KaduKessler/kadukessler.com/actions/workflows/deploy.yml/badge.svg)](https://github.com/KaduKessler/kadukessler.com/actions/workflows/deploy.yml)
  [![Biome Lint](https://github.com/KaduKessler/kadukessler.com/actions/workflows/biome-lint.yml/badge.svg)](https://github.com/KaduKessler/kadukessler.com/actions/workflows/biome-lint.yml)
  [![Site](https://img.shields.io/badge/site-kadukessler.com-black)](https://kadukessler.com)
</div>

## Destaques

- **Bilíngue** (PT/EN) via i18next, com troca de idioma sem reload
- **Tema claro/escuro** com transição suave (`document.startViewTransition`)
- **Conteúdo em MDX**: projetos e posts de blog compilados pelo Velite, sem CMS externo
- **Case studies de projeto**: página própria por projeto, com galeria em lightbox e navegação prev/next
- **Deploy automático**: push em `main` builda e publica sozinho, sem passo manual

## Stack

| Camada | Tecnologias |
|--------|-------------|
| UI | React 19, TypeScript, Tailwind CSS v4 |
| Animações | Motion (Framer Motion) |
| Roteamento | React Router v7 |
| i18n | i18next + react-i18next (PT / EN) |
| Conteúdo | Velite (MDX + frontmatter) — projetos e blog |
| Build | Vite 8 |
| Qualidade | Biome (lint + format) |
| Deploy | GitHub Actions + rsync + PM2 |

## Estrutura

```
src/
├── components/
│   ├── pages/       # Home, Projects, ProjectDetail, Blog, BlogPost
│   ├── sections/    # Hero, About, Experience, Education, Stack, Contact, ProjectCards
│   └── ui/          # Background, ThemeToggle, LanguageToggle, FadeInImage, etc.
├── lib/             # i18n, projects, blog, flags, utils
└── locales/         # pt.json, en.json
projects/            # Case studies em MDX (collection "Project" no Velite)
posts/               # Posts de blog em MDX (collection "Post" no Velite, atrás de flag)
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

---

<div align="center">
  <sub>Feito por <a href="https://kadukessler.com">Kadu Kessler</a> · <a href="https://github.com/KaduKessler">github.com/KaduKessler</a></sub>
</div>
