import { useMemo } from "react";
import * as runtime from "react/jsx-runtime";

/**
 * Renderiza o conteúdo MDX gerado pelo Velite.
 * Usa useMemo para evitar re-renderizações desnecessárias durante o scroll.
 */
export function MDXContent({
	code,
	components,
}: {
	code: string;
	components?: Record<string, React.ComponentType<Record<string, unknown>>>;
}) {
	const Content = useMemo(() => {
		const getComponent = new Function(
			"runtime",
			`
        const { jsx, jsxs, Fragment } = runtime;
        ${code}
        return { default: typeof MDXContent !== 'undefined' ? MDXContent : defaultExport };
      `,
		);

		return getComponent(runtime).default;
	}, [code]);

	return <Content components={components} />;
}
