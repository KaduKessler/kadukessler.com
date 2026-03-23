import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Education } from "@/components/sections/education";
import { Experience } from "@/components/sections/experience";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { Stack } from "@/components/sections/stack";

export default function App() {
	return (
		<main className="mx-auto flex max-w-2xl flex-col gap-16 px-4 py-16 sm:px-6 md:gap-20 md:py-24">
			<Hero />
			<About />
			<Experience />
			<Education />
			<Stack />
			<Contact />
			<Footer />
		</main>
	);
}
