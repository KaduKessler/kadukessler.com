import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Education } from "@/components/sections/education";
import { Experience } from "@/components/sections/experience";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { Stack } from "@/components/sections/stack";
import { Background } from "@/components/ui/background";
import { FloatingNav } from "@/components/ui/floating-nav";
import { BackToTop, ScrollProgress } from "@/components/ui/scroll-utils";

const personJsonLd = {
	"@context": "https://schema.org",
	"@type": "Person",
	name: "Kadu Kessler",
	url: "https://kadukessler.com",
	jobTitle: "Full-Stack Developer",
	worksFor: {
		"@type": "Organization",
		name: "2M/MPE",
		url: "https://mpe.com.br/quem-somos/",
	},
	alumniOf: {
		"@type": "CollegeOrUniversity",
		name: "PUCRS",
		url: "https://www.pucrs.br",
	},
	address: {
		"@type": "PostalAddress",
		addressLocality: "Santa Maria",
		addressRegion: "RS",
		addressCountry: "BR",
	},
	sameAs: ["https://github.com/kadukessler"],
	email: "contato@kadukessler.com",
};

export function Home() {
	const { hash } = useLocation();

	useEffect(() => {
		if (!hash) return;
		const el = document.getElementById(hash.replace("#", ""));
		el?.scrollIntoView({ behavior: "smooth" });
	}, [hash]);

	return (
		<main className="relative mx-auto flex max-w-2xl flex-col gap-16 px-4 pt-32 pb-16 sm:px-6 md:gap-20 md:pt-40 md:pb-24">
			<script type="application/ld+json">{JSON.stringify(personJsonLd)}</script>
			<Background />
			<ScrollProgress />
			<FloatingNav />

			<Hero />

			<div id="about">
				<About />
			</div>

			<div id="experience">
				<Experience />
			</div>

			<div id="education">
				<Education />
			</div>

			<div id="stack">
				<Stack />
			</div>

			<div id="projects">
				<Projects />
			</div>

			<Contact />
			<Footer />

			<BackToTop />
		</main>
	);
}
