import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Education } from "@/components/sections/education";
import { Experience } from "@/components/sections/experience";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { Stack } from "@/components/sections/stack";
import { FloatingNav } from "@/components/ui/floating-nav";
import { BackToTop, ScrollProgress } from "@/components/ui/scroll-utils";

export default function App() {
	return (
		<main className="relative mx-auto flex max-w-2xl flex-col gap-16 px-4 pt-32 pb-16 sm:px-6 md:gap-20 md:pt-40 md:pb-24">
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

			<Contact />
			<Footer />

			<BackToTop />
		</main>
	);
}
