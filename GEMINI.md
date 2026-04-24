# Guia de Engenharia - kadukessler.com

Este documento define as convenções de código, padrões arquiteturais e fluxos de trabalho obrigatórios para este projeto.

## 🛠️ Stack Tecnológica

- **Framework:** React 19 (TypeScript)
- **Build Tool:** Vite 6+
- **Estilização:** Tailwind CSS v4
- **Conteúdo:** Velite (MDX pré-compilado)
- **Lint/Format:** Biome.js
- **i18n:** react-i18next

## 📏 Padrões de Código & Biome.js

### 1. Rigor com Tipagem

- **Zero `any`:** Nunca utilize `any`. Se uma tag personalizada for necessária no JSX (ex: para o componente `Trans`), ela deve ser declarada em `src/types.d.ts` usando `React.DetailedHTMLProps`.
- **Interfaces vs Types:** Prefira `interface` para definições de props de componentes e `type` para uniões ou tipos utilitários.

### 2. Linting e Formatação (Biome)

- Sempre rode `pnpm lint` e `pnpm format` antes de concluir uma tarefa.
- O Biome é a fonte da verdade para estilo. Não ignore avisos; corrija-os seguindo as sugestões da ferramenta.
- Evite suprimir regras do Biome com comentários `// biome-ignore` a menos que seja estritamente necessário e justificado.

## 🚀 Performance & Build

### 1. Vite & Plugins

- **Mantenha o Build Enxuto:** Não adicione plugins redundantes. O processamento de MDX é responsabilidade exclusiva do **Velite**. O Vite não deve possuir plugins de MDX para evitar double-processing.
- **Bundle Size:** Fique atento ao aviso de chunks maiores que 500kB. Se necessário, utilize `React.lazy` para code-splitting em rotas pesadas.

### 2. Fluxo do Conteúdo (Velite)

- Todo conteúdo em markdown deve ser processado via Velite.
- O componente `MDXContent.tsx` é o responsável por renderizar o código pré-compilado. Não tente importar arquivos `.mdx` diretamente nos componentes React.

## 🌍 Internacionalização (i18n)

### 1. Padrão de Tags no `Trans`

- Para manter a legibilidade das traduções, utilizamos tags semânticas (ex: `<dotnet>`, `<alertai>`).
- **Sempre** registre novas tags em `src/types.d.ts` para garantir que o build do `tsc` não quebre.
- Mantenha as chaves de tradução organizadas e espelhadas entre `en` e `pt`.

## 🛠️ Checklist de Validação (Antes de entregar)

1. `pnpm build`: O build deve completar sem erros (incluindo o passo de `tsc -b`).
2. `pnpm lint`: Zero erros de linting.
3. **Performance:** O tempo de build do Vite não deve regredir significativamente sem uma justificativa clara.
4. **Mobile First:** Verifique se novas seções mantêm a responsividade.

---
*Este guia deve ser lido por todo agente antes de iniciar modificações no projeto.*
