export function PageMetadata({
	title = "Kadu Kessler | Full-Stack Developer",
	description = "Kadu Kessler, Full-Stack Developer. .NET and React at 2M/MPE, plus web projects for clients. ADS graduate from PUCRS, based in Santa Maria, RS.",
	pathname = "/",
	image = "/images/og-image.png",
}: {
	title?: string;
	description?: string;
	pathname?: string;
	image?: string;
}) {
	const url = `https://kadukessler.com${pathname}`;
	const imageUrl = `https://kadukessler.com${image}`;
	return (
		<>
			<title>{title}</title>
			<meta name="description" content={description} />
			<link rel="canonical" href={url} />
			<meta property="og:type" content="website" />
			<meta property="og:url" content={url} />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:image" content={imageUrl} />
			<meta property="twitter:card" content="summary_large_image" />
			<meta property="twitter:url" content={url} />
			<meta property="twitter:title" content={title} />
			<meta property="twitter:description" content={description} />
			<meta property="twitter:image" content={imageUrl} />
		</>
	);
}
