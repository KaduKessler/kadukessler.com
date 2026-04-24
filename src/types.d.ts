import "react";

declare module "react" {
	namespace JSX {
		interface IntrinsicElements {
			dotnet: React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLElement>,
				HTMLElement
			>;
			react: React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLElement>,
				HTMLElement
			>;
			role: React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLElement>,
				HTMLElement
			>;
			company: React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLElement>,
				HTMLElement
			>;
			alertai: React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLElement>,
				HTMLElement
			>;
			course: React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLElement>,
				HTMLElement
			>;
			uni: React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLElement>,
				HTMLElement
			>;
			proxmox: React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLElement>,
				HTMLElement
			>;
			oci: React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLElement>,
				HTMLElement
			>;
		}
	}
}
