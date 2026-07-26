import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

const resources = {
	en: {
		translation: {
			nav: {
				about: "About",
				experience: "Experience",
				education: "Education",
				stack: "Stack",
				projects: "Projects",
				blog: "Blog",
				menu: "Menu",
			},
			common: {
				backHome: "Home",
				backFeed: "Feed",
				exploreMore: "Explore more",
				endOfEntry: "End of entry",
				goHome: "Go home",
				readFullStory: "Read full story",
				latestStory: "Latest story",
				searchPosts: "Search posts...",
				searchTags: "Search tags...",
				allTags: "All Tags",
				noResults: "No results found",
				clearFilters: "Clear all filters",
				minRead: "{{count}} MIN READ",
				shareStory: "Share story",
				copyEmail: "Email copied to clipboard",
				backToTop: "Back to top",
			},
			hero: {
				taglines: ["Full-Stack Junior", ".NET + React", "Above and Beyond"],
				location: "Location",
				localTime: "Local Time",
				currentRole: "Current Role",
				timezoneHint: "same timezone as you",
				ahead: "h ahead",
				behind: "h behind",
			},
			about: {
				title: "About",
				p1: "Full-Stack Developer focused on <dotnet>.NET</dotnet> and <react>React</react>, currently working as a <role>Full-Stack Junior</role> at <company>2M/MPE</company>. I build production-ready systems, integrate IoT devices, and manage complex data flows.",
				p2: "I'm a core contributor to <alertai>AlertAI</alertai>, a web platform for event management, security, and intelligent monitoring. Currently finishing my degree in <course>Analysis and Systems Development</course> at <uni>PUCRS</uni>.",
				p3: "Beyond building software, I enjoy infrastructure and understanding how things work from end-to-end. I run a home setup with <proxmox>Proxmox</proxmox> and manage cloud instances on <oci>OCI (Oracle Linux)</oci> to host my own services and experiment with the DevOps mindset.",
				p4: "In my free time, I'm usually iterating on new ideas, watching anime, or gaming; always driven by the curiosity of creating practical solutions.",
			},
			experience: {
				title: "Experience",
				types: {
					clt: "Full-time",
					freelance: "Freelance",
					contract: "Contract (ad-hoc)",
				},
				current: "Current",
				toggleDetails: "Toggle details for {{role}}",
				items: [
					{
						company: "2M/MPE",
						roles: [
							{
								title: "Full-Stack Junior",
								period: "04.2026 — Present",
								current: true,
								description:
									"Working with .NET, React, and IoT integrations for the AlertAI security platform. Focused on scalable monitoring, real-time events, and high-performance infrastructure.",
							},
							{
								title: "Full-Stack Trainee",
								period: "12.2025 — 04.2026",
								description:
									"Started building security monitoring modules and real-time visualization tools for internal and customer-facing workflows.",
							},
						],
					},
					{
						company: "Self-employed",
						roles: [
							{
								title: "Web Developer",
								period: "12.2024 — 12.2025",
								description:
									"Delivered institutional websites in WordPress with responsive design, hosting/domain setup, plugin customization, and SEO/performance improvements.",
							},
						],
					},
					{
						company: "Eloo Perícias",
						roles: [
							{
								title: "Software Developer",
								period: "05.2022 — 12.2024",
								description:
									"Built automation tools for data collection, report generation, and financial workflows, including web systems and VBA scripts for internal operations.",
							},
						],
					},
				],
			},
			education: {
				title: "Education",
				inProgress: "In progress",
				toggleDetails: "Toggle details for {{institution}}",
				items: [
					{
						institution: "PUCRS",
						fullName: "Pontifical Catholic University of Rio Grande do Sul",
						course: "Analysis and Systems Development",
						description:
							"Full-stack curriculum centered on end-to-end delivery: React/Vite/MUI on the front-end, Node.js/TypeScript REST APIs with Docker and Prisma/SQL on the back-end, and microservices architecture with API Gateway, RabbitMQ, and cache strategies. Also covered secure engineering with cryptography fundamentals, STRIDE threat modeling, and LGPD-oriented practices.",
						period: "02.2024 — 2026",
						current: true,
					},
					{
						institution: "UFSM",
						fullName: "Federal University of Santa Maria",
						course: "Technical Degree in Informatics",
						description:
							"Built a strong technical foundation in relational modeling and SQL with PostgreSQL, plus practical web development using HTML/CSS, Bulma/Sass, and Django/Python integrations. Delivered a Java prototype for credit recovery workflows, studied networking fundamentals, and completed a capstone focused on designing and implementing a REST API with Django REST Framework.",
						period: "05.2021 — 12.2023",
					},
				],
			},
			stack: {
				title: "Stack",
				categories: {
					languages: "Languages & Runtimes",
					frameworks: "Frameworks & Libraries",
					infrastructure: "Infrastructure & Ecosystem",
				},
			},
			projects: {
				title: "Projects",
				present: "Present",
				viewDetails: "View details",
				viewLive: "View live",
				viewRepo: "Repository",
				timeline: "Timeline",
				status: "Status",
				links: "Links",
				references: "References",
				viewAll: "View all projects",
				empty: "No projects yet.",
				searchPlaceholder: "Search projects...",
				allTypes: "All",
				privateBadge: "Private",
				publicBadge: "Public",
				noPublicLink:
					"No public repository or demo. This page is the only reference available.",
				back: "Back to projects",
			},
			contact: {
				title: "Contact",
				description:
					"Feel free to reach out; whether it's about a project, a collaboration, an opportunity, or just to say hi. I'm always open to connect.",
				sendEmail: "Send an email",
			},
			footer: {
				builtBy: "Built by",
			},
		},
	},
	pt: {
		translation: {
			nav: {
				about: "Sobre",
				experience: "Experiência",
				education: "Formação",
				stack: "Stack",
				projects: "Projetos",
				blog: "Blog",
				menu: "Menu",
			},
			common: {
				backHome: "Início",
				backFeed: "Feed",
				exploreMore: "Explore mais",
				endOfEntry: "Fim da entrada",
				goHome: "Voltar ao início",
				readFullStory: "Ler história completa",
				latestStory: "Última história",
				searchPosts: "Buscar posts...",
				searchTags: "Buscar tags...",
				allTags: "Todas as Tags",
				noResults: "Nenhum resultado encontrado",
				clearFilters: "Limpar todos os filtros",
				minRead: "{{count}} MIN DE LEITURA",
				shareStory: "Compartilhar",
				copyEmail: "E-mail copiado!",
				backToTop: "Voltar ao topo",
			},
			hero: {
				taglines: ["Full-Stack Junior", ".NET + React", "Above and Beyond"],
				location: "Localização",
				localTime: "Hora Local",
				currentRole: "Cargo Atual",
				timezoneHint: "mesmo fuso horário que você",
				ahead: "h à frente",
				behind: "h atrás",
			},
			about: {
				title: "Sobre",
				p1: "Desenvolvedor Full-Stack focado em <dotnet>.NET</dotnet> e <react>React</react>, atualmente trabalhando como <role>Full-Stack Junior</role> na <company>2M/MPE</company>. Construo sistemas prontos para produção, integro dispositivos IoT e gerencio fluxos de dados complexos.",
				p2: "Sou um dos principais contribuidores do <alertai>AlertAI</alertai>, uma plataforma web para gestão de eventos, segurança e monitoramento inteligente. Atualmente cursando <course>Análise e Desenvolvimento de Sistemas</course> na <uni>PUCRS</uni>.",
				p3: "Além de construir software, gosto de infraestrutura e de entender como as coisas funcionam de ponta a ponta. Mantenho um laboratório doméstico com <proxmox>Proxmox</proxmox> e gerencio instâncias em nuvem na <oci>OCI (Oracle Linux)</oci> para hospedar meus próprios serviços e experimentar com a mentalidade DevOps.",
				p4: "No meu tempo livre, costumo iterar em novas ideias, assistir anime ou jogar; sempre movido pela curiosidade de criar soluções práticas.",
			},
			experience: {
				title: "Experiência",
				types: {
					clt: "Tempo Integral",
					freelance: "Freelance",
					contract: "Contrato (ad-hoc)",
				},
				current: "Atual",
				toggleDetails: "Alternar detalhes para {{role}}",
				items: [
					{
						company: "2M/MPE",
						roles: [
							{
								title: "Full-Stack Junior",
								period: "04.2026 — Presente",
								current: true,
								description:
									"Trabalhando com .NET, React e integrações IoT para a plataforma de segurança AlertAI. Focado em monitoramento escalável, eventos em tempo real e infraestrutura de alta performance.",
							},
							{
								title: "Full-Stack Trainee",
								period: "12.2025 — 04.2026",
								description:
									"Iniciei a construção de módulos de monitoramento de segurança e ferramentas de visualização em tempo real para fluxos de trabalho internos e voltados ao cliente.",
							},
						],
					},
					{
						company: "Autônomo",
						roles: [
							{
								title: "Web Developer",
								period: "12.2024 — 12.2025",
								description:
									"Entrega de sites institucionais em WordPress com design responsivo, configuração de hospedagem/domínio, customização de plugins e melhorias de SEO/performance.",
							},
						],
					},
					{
						company: "Eloo Perícias",
						roles: [
							{
								title: "Software Developer",
								period: "05.2022 — 12.2024",
								description:
									"Construção de ferramentas de automação para coleta de dados, geração de relatórios e fluxos financeiros, incluindo sistemas web e scripts VBA para operações internas.",
							},
						],
					},
				],
			},
			education: {
				title: "Formação",
				inProgress: "Em andamento",
				toggleDetails: "Alternar detalhes para {{institution}}",
				items: [
					{
						institution: "PUCRS",
						fullName: "Pontifícia Universidade Católica do Rio Grande do Sul",
						course: "Análise e Desenvolvimento de Sistemas",
						description:
							"Currículo full-stack centrado na entrega de ponta a ponta: React/Vite/MUI no front-end, APIs REST Node.js/TypeScript com Docker e Prisma/SQL no back-end, e arquitetura de microserviços com API Gateway, RabbitMQ e estratégias de cache. Também cobriu engenharia segura com fundamentos de criptografia, modelagem de ameaças STRIDE e práticas orientadas à LGPD.",
						period: "02.2024 — 2026",
						current: true,
					},
					{
						institution: "UFSM",
						fullName: "Universidade Federal de Santa Maria",
						course: "Técnico em Informática",
						description:
							"Construção de uma base técnica sólida em modelagem relacional e SQL com PostgreSQL, além de desenvolvimento web prático usando HTML/CSS, Bulma/Sass e integrações Django/Python. Entreguei um protótipo Java para fluxos de recuperação de crédito, estudei fundamentos de redes e completei um TCC focado no design e implementação de uma API REST com Django REST Framework.",
						period: "05.2021 — 12.2023",
					},
				],
			},
			stack: {
				title: "Stack",
				categories: {
					languages: "Linguagens & Runtimes",
					frameworks: "Frameworks & Bibliotecas",
					infrastructure: "Infraestrutura & Ecossistema",
				},
			},
			projects: {
				title: "Projetos",
				present: "Presente",
				viewDetails: "Ver detalhes",
				viewLive: "Ver ao vivo",
				viewRepo: "Repositório",
				timeline: "Linha do tempo",
				status: "Status",
				links: "Links",
				references: "Referências",
				viewAll: "Ver todos os projetos",
				empty: "Nenhum projeto ainda.",
				searchPlaceholder: "Buscar projetos...",
				allTypes: "Todos",
				privateBadge: "Privado",
				publicBadge: "Público",
				noPublicLink:
					"Sem repositório ou demo pública. Esta página é a única referência disponível.",
				back: "Voltar pra projetos",
			},
			contact: {
				title: "Contato",
				description:
					"Sinta-se à vontade para entrar em contato; seja sobre um projeto, uma colaboração, uma oportunidade ou apenas para dar um oi. Estou sempre aberto a novas conexões.",
				sendEmail: "Enviar um e-mail",
			},
			footer: {
				builtBy: "Desenvolvido por",
			},
		},
	},
};

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng: "en",
		interpolation: {
			escapeValue: false,
		},
		detection: {
			order: ["querystring", "localStorage", "navigator"],
			caches: ["localStorage"],
		},
	});

export default i18n;
