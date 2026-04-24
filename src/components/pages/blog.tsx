import {
	ArrowLeft,
	ArrowRight,
	Calendar,
	ChevronDown,
	Clock3,
	Search,
	Tag,
	X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { LanguageReveal } from "@/components/ui/language-reveal";
import { LanguageToggle } from "@/components/ui/language-toggle";
import {
	SectionReveal,
	Stagger,
	StaggerItem,
} from "@/components/ui/section-reveal";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getAllPosts, getAllTags } from "@/lib/blog";

export function Blog() {
	const { t } = useTranslation();
	const allPosts = useMemo(() => getAllPosts(), []);
	const allTags = useMemo(() => getAllTags(), []);

	const [selectedTag, setSelectedTag] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [tagSearch, setTagSearch] = useState("");
	const [isTagsOpen, setIsTagsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsTagsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const filteredTags = useMemo(() => {
		return allTags.filter((tag) =>
			tag.toLowerCase().includes(tagSearch.toLowerCase()),
		);
	}, [allTags, tagSearch]);

	const filteredPosts = useMemo(() => {
		return allPosts.filter((post) => {
			const matchesTag = !selectedTag || post.tags.includes(selectedTag);
			const matchesSearch =
				post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
			return matchesTag && matchesSearch;
		});
	}, [allPosts, selectedTag, searchQuery]);

	const isFiltering = !!selectedTag || searchQuery.length > 0;
	const featuredPost =
		filteredPosts.length > 0 && !isFiltering ? filteredPosts[0] : null;
	const displayPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;

	return (
		<div className="container max-w-4xl mx-auto px-6 pt-10 pb-24 sm:pt-16 sm:pb-32">
			{/* Unified Header Navigation */}
			<SectionReveal className="relative z-[110] mb-12">
				<div className="flex flex-col gap-8">
					<div className="flex items-center justify-between">
						<Link
							to="/"
							className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
						>
							<ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
							<LanguageReveal inline>{t("common.backHome")}</LanguageReveal>
						</Link>
						<div className="flex items-center gap-1">
							<LanguageToggle />
							<ThemeToggle />
						</div>
					</div>

					<div className="flex flex-col gap-1">
						<h1 className="text-5xl sm:text-7xl font-bold tracking-tighter text-foreground italic flex items-baseline gap-2">
							Blog
							<span className="text-primary text-6xl sm:text-8xl leading-[0]">
								.
							</span>
						</h1>
					</div>
				</div>
			</SectionReveal>

			{/* Filters Section */}
			<div className="relative z-[100] mb-10">
				<SectionReveal>
					<div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
						{/* Search Bar */}
						<div className="relative group sm:col-span-8">
							<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
							<input
								type="text"
								placeholder={t("common.searchPosts")}
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full bg-card/20 border border-border/60 rounded-xl py-2.5 pl-11 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all placeholder:text-muted-foreground/40"
							/>
							{searchQuery && (
								<button
									type="button"
									onClick={() => setSearchQuery("")}
									className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
								>
									<X className="size-3.5 text-muted-foreground/60" />
								</button>
							)}
						</div>

						{/* Tag Filter */}
						<div className="relative sm:col-span-4" ref={dropdownRef}>
							<button
								type="button"
								onClick={() => {
									setIsTagsOpen(!isTagsOpen);
									if (!isTagsOpen) setTagSearch("");
								}}
								className={`w-full h-full flex items-center justify-between bg-card/20 border rounded-xl py-2.5 px-4 text-sm font-medium transition-all ${
									selectedTag
										? "border-primary/40 text-primary bg-primary/5 shadow-[0_0_20px_rgba(var(--primary),0.1)]"
										: "border-border/60 text-muted-foreground hover:bg-muted/30 hover:text-foreground"
								}`}
							>
								<span className="flex items-center gap-2 truncate">
									<Tag
										className={`size-3.5 ${selectedTag ? "text-primary" : "text-muted-foreground/50"}`}
									/>
									{selectedTag || "Tags"}
								</span>
								<ChevronDown
									className={`size-4 shrink-0 transition-transform duration-300 ${isTagsOpen ? "rotate-180" : ""}`}
								/>
							</button>

							{isTagsOpen && (
								<div className="absolute right-0 top-[calc(100%+8px)] w-full min-w-[220px] bg-card border border-border/80 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-[110] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200 origin-top">
									<div className="p-3 border-b border-border/60 bg-muted/40">
										<div className="relative">
											<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60" />
											<input
												type="text"
												placeholder={t("common.searchTags")}
												value={tagSearch}
												onChange={(e) => setTagSearch(e.target.value)}
												className="w-full bg-background border border-border/60 rounded-lg py-1.5 pl-8 pr-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40"
											/>
										</div>
									</div>

									<div className="max-h-[240px] overflow-y-auto p-1.5 bg-card custom-scrollbar">
										<button
											type="button"
											onClick={() => {
												setSelectedTag(null);
												setIsTagsOpen(false);
											}}
											className={`w-full text-left px-3 py-2.5 text-xs rounded-lg transition-colors flex items-center justify-between group/item ${
												selectedTag === null
													? "bg-primary/15 text-primary font-bold"
													: "text-muted-foreground hover:bg-muted hover:text-foreground"
											}`}
										>
											<LanguageReveal inline>
												{t("common.allTags")}
											</LanguageReveal>
											{selectedTag === null && (
												<div className="size-1.5 rounded-full bg-primary" />
											)}
										</button>
										<div className="h-px bg-border/40 my-1.5 mx-2" />
										{filteredTags.length > 0 ? (
											filteredTags.map((tag) => (
												<button
													key={tag}
													type="button"
													onClick={() => {
														setSelectedTag(tag);
														setIsTagsOpen(false);
													}}
													className={`w-full text-left px-3 py-2.5 text-xs rounded-lg transition-colors flex items-center justify-between group/item ${
														selectedTag === tag
															? "bg-primary/15 text-primary font-bold"
															: "text-muted-foreground hover:bg-muted hover:text-foreground"
													}`}
												>
													{tag}
													{selectedTag === tag && (
														<div className="size-1.5 rounded-full bg-primary" />
													)}
												</button>
											))
										) : (
											<div className="px-3 py-4 text-center text-xs text-muted-foreground italic">
												<LanguageReveal inline>
													{t("common.noResults")}
												</LanguageReveal>
											</div>
										)}
									</div>
								</div>
							)}
						</div>
					</div>
				</SectionReveal>
			</div>

			{/* Content Area */}
			<div className="flex flex-col gap-8 relative z-0">
				{featuredPost && (
					<SectionReveal delay={0.2}>
						<Link
							to={`/blog/${featuredPost.slug}`}
							className="group relative flex flex-col gap-4 p-6 sm:p-8 rounded-3xl border border-border/60 bg-card/10 hover:border-primary/30 hover:bg-card/20 transition-all duration-300 overflow-hidden"
						>
							<div className="flex flex-wrap items-center gap-4 text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/60">
								<span className="flex items-center gap-2 px-2 py-0.5 rounded-md bg-primary text-primary-foreground font-bold text-[8px]">
									<LanguageReveal inline>
										{t("common.latestStory")}
									</LanguageReveal>
								</span>
								<span className="flex items-center gap-2">
									<Calendar className="size-3" />
									{new Date(featuredPost.publishedAt).toLocaleDateString(
										"en-US",
										{ month: "long", day: "2-digit", year: "numeric" },
									)}
								</span>
								<span className="flex items-center gap-2">
									<Clock3 className="size-3" />
									<LanguageReveal inline>
										{t("common.minRead", {
											count: featuredPost.readingTimeMinutes,
										})}
									</LanguageReveal>
								</span>
							</div>

							<div className="flex flex-col gap-3 max-w-2xl relative z-10">
								<h2 className="text-2xl sm:text-4xl font-bold tracking-tight group-hover:text-primary transition-colors leading-tight">
									{featuredPost.title}
								</h2>
								<p className="text-muted-foreground/70 text-sm sm:text-base leading-relaxed line-clamp-2">
									{featuredPost.excerpt}
								</p>
							</div>

							<div className="flex items-center gap-2 text-xs font-bold text-primary">
								<LanguageReveal inline>
									{t("common.readFullStory")}
								</LanguageReveal>
								<ArrowRight className="size-4 group-hover:translate-x-1.5 transition-transform" />
							</div>
						</Link>
					</SectionReveal>
				)}

				{displayPosts.length > 0 ? (
					<Stagger
						key={selectedTag || searchQuery || "initial"}
						className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
						delay={0.05}
					>
						{displayPosts.map((post) => (
							<StaggerItem key={post.slug} className="flex flex-col h-full">
								<Link
									to={`/blog/${post.slug}`}
									className="group flex flex-col h-full gap-5 p-6 rounded-2xl border border-border/40 bg-card/10 hover:border-primary/20 hover:bg-card/20 transition-all duration-300"
								>
									<div className="flex items-center justify-between text-[10px] font-mono font-bold text-muted-foreground/50 uppercase tracking-widest">
										<span className="flex items-center gap-2">
											<Calendar className="size-3" />
											{new Date(post.publishedAt)
												.toLocaleDateString("en-US", {
													day: "2-digit",
													month: "short",
													year: "numeric",
												})
												.toUpperCase()}
										</span>
										<span className="flex items-center gap-2">
											<Clock3 className="size-3" />
											<LanguageReveal inline>
												{
													t("common.minRead", {
														count: post.readingTimeMinutes,
													}).split(" ")[0]
												}
											</LanguageReveal>
										</span>
									</div>

									<div className="flex flex-col gap-2.5 flex-grow">
										<h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors line-clamp-2 leading-tight">
											{post.title}
										</h3>
										<p className="text-muted-foreground/70 text-[13px] leading-relaxed line-clamp-3">
											{post.excerpt}
										</p>
									</div>

									<div className="flex flex-wrap gap-2 pt-4 border-t border-border/20">
										{post.tags.slice(0, 3).map((tag) => (
											<span
												key={tag}
												className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground/50"
											>
												<Tag className="size-2.5" />
												{tag}
											</span>
										))}
									</div>
								</Link>
							</StaggerItem>
						))}
					</Stagger>
				) : (
					!featuredPost && (
						<SectionReveal>
							<div className="flex flex-col items-center justify-center py-20 text-center gap-5 border border-dashed border-border/40 rounded-2xl bg-card/10">
								<div className="size-16 rounded-full bg-muted/20 flex items-center justify-center">
									<Search className="size-8 text-muted-foreground/40" />
								</div>
								<div className="flex flex-col gap-1">
									<h3 className="text-xl font-bold">
										<LanguageReveal inline>
											{t("common.noResults")}
										</LanguageReveal>
									</h3>
									<p className="text-muted-foreground/60 text-sm max-w-[200px] mx-auto">
										Try adjusting your search filters.
									</p>
								</div>
								<button
									type="button"
									onClick={() => {
										setSelectedTag(null);
										setSearchQuery("");
									}}
									className="text-xs font-bold text-primary hover:underline"
								>
									<LanguageReveal inline>
										{t("common.clearFilters")}
									</LanguageReveal>
								</button>
							</div>
						</SectionReveal>
					)
				)}
			</div>
		</div>
	);
}
