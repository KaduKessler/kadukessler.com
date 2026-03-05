# kadukessler.com

Portfolio pessoal construído com React + Vite + TypeScript.

## Scripts

- `pnpm dev`: roda o ambiente de desenvolvimento.
- `pnpm build`: gera build de produção.
- `pnpm preview`: serve o build localmente.
- `pnpm lint`: valida o código com Biome.
- `pnpm format`: formata o código com Biome.

## Qualidade de código

Este projeto usa Biome como ferramenta principal de lint/format.

- Local: `pnpm lint`
- CI: workflow `Biome Lint` em `.github/workflows/biome-lint.yml`
