const SITE = "https://kadukessler.com";
// Most networks cut link descriptions near this length.
const MAX_DESCRIPTION = 155;

function shorten(text: string, max = MAX_DESCRIPTION) {
	if (text.length <= max) return text;
	const cut = text.slice(0, max - 1);
	return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

export function PageMetadata({
	title = "Kadu Kessler | Full-Stack Developer",
	description = "Kadu Kessler, Full-Stack Developer. .NET and React at 2M/MPE, plus web projects for clients. ADS graduate from PUCRS, based in Santa Maria, RS.",
	pathname = "/",
	image = "/images/og/home.jpg",
	imageAlt = "Kadu Kessler, Full-Stack Developer",
}: {
	title?: string;
	description?: string;
	pathname?: string;
	/** A 1200x630 JPEG, see scripts/generate-og.mjs. */
	image?: string;
	imageAlt?: string;
}) {
	const url = `${SITE}${pathname}`;
	const imageUrl = `${SITE}${image}`;
	const text = shorten(description);
	return (
		<>
			<title>{title}</title>
			<meta name="description" content={text} />
			<link rel="canonical" href={url} />
			<meta property="og:type" content="website" />
			<meta property="og:site_name" content="Kadu Kessler" />
			<meta property="og:locale" content="en_US" />
			<meta property="og:locale:alternate" content="pt_BR" />
			<meta property="og:url" content={url} />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={text} />
			<meta property="og:image" content={imageUrl} />
			<meta property="og:image:type" content="image/jpeg" />
			<meta property="og:image:width" content="1200" />
			<meta property="og:image:height" content="630" />
			<meta property="og:image:alt" content={imageAlt} />
			<meta property="twitter:card" content="summary_large_image" />
			<meta property="twitter:url" content={url} />
			<meta property="twitter:title" content={title} />
			<meta property="twitter:description" content={text} />
			<meta property="twitter:image" content={imageUrl} />
			<meta property="twitter:image:alt" content={imageAlt} />
		</>
	);
}
