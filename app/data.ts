export type Feature = {
	id: number;
	title: string;
	description: string;
	icon: string;
};

export type Course = {
	id: number;
	title: string;
	category: string;
	level: "Beginner" | "Intermediate" | "Advanced";
	duration: string;
	highlights: string[];
};

export type Mentor = {
	id: number;
	name: string;
	role: string;
	company: string;
	bio: string;
	avatar: string;
};

export type Testimonial = {
	id: number;
	quote: string;
	name: string;
	role: string;
};

export type Stat = {
	id: number;
	label: string;
	value: string;
	detail: string;
};

export type BlogPost = {
	id: number;
	title: string;
	excerpt: string;
	date: string;
	readingTime: string;
	category: string;
	image: string;
	author: string;
};

export type GalleryItem = {
	id: number;
	title: string;
	description: string;
	image: string;
	category: string;
};

export type Service = {
	id: number;
	title: string;
	description: string;
	outcomes: string[];
};

export type TeamMember = {
	id: number;
	name: string;
	title: string;
	focus: string;
	bio: string;
};

export const aboutUsData = {
  about: "Founded in 2021, NepaTronix is a leading Nepal-based IoT, STEM EdTech, and software company committed to closing the gap between education and innovation. Built on the belief that education should inspire creativity, cultivate practical skills, and lead to meaningful invention, NepaTronix operates at the intersection of engineering, education, and social impact.",
  mission: "To revolutionizing the technological landscape of Nepal by empowering youth with industry-relevant skills and promoting indigenous product development.",
  vision: "To be the leading catalyst in Nepal's journey towards technological self-sufficiency and innovation.",
  ceo: {
    name: "Razu Shrestha",
    role: "CEO and Founder",
    message: "At Nepatronix, we are committed to building a future where innovation, education, and engineering come together to create real-world impact. Our focus is on empowering students, educators, and industries through practical STEM education, advanced technology solutions, and globally aligned engineering services while staying rooted in Nepal’s needs and values. We believe in long-term thinking, ethical innovation, and meaningful collaboration as we grow from a national leader to a global technology partner. Our mission is simple: to transform ideas into impactful solutions that shape the future.",
    image: "/Raju%20Shrestha.jpg",
    socials: {
      facebook: "https://www.facebook.com/NepaTronixx",
      whatsapp: "https://wa.me/9779803661701",
      linkedin: "https://www.linkedin.com/in/razu-shrestha-1a732024b/"
    }
  },
  verticals: [
    { title: "Innovator", description: "Providing STEM kits and training modules for schools and colleges." },
    { title: "Nep STEM", description: "Research and development solutions for local industries." },
    { title: "R&D", description: "End-to-end product design, prototyping, and manufacturing." },
    { title: "KMS", description: "Vocational training and workshops for aspiring engineers." }
  ],
  whyChooseUs: [
    { title: "Local Expertise", description: "Deep understanding of the local market and technological challenges." },
    { title: "Industry-Ready Training", description: "Curriculum designed by practicing engineers and industry veterans." },
    { title: "Innovation Focus", description: "Commitment to R&D and creating novel solutions." },
    { title: "End-to-End Support", description: "From initial concept to final product, we guide you through every step." },
    { title: "Expert Team", description: "Led by a team of passionate engineers and educators." },
    { title: "Proven Track Record", description: "Succcessful collaborations with top institutions and industries." }
  ]
};

export const features: Feature[] = [
	{
		id: 1,
		title: "Personalized Learning Paths",
		description:
			"Adaptive curricula and AI-powered study planners that evolve with every learner.",
		icon: "target",
	},
	{
		id: 2,
		title: "Mentorship at Scale",
		description:
			"Weekly live sessions with industry experts, featuring feedback loops and project reviews.",
		icon: "mentor",
	},
	{
		id: 3,
		title: "Career Launchpad",
		description:
			"Interview prep, portfolio showcases, and employer matchmaking built into the platform.",
		icon: "launch",
	},
	{
		id: 4,
		title: "Real-World Projects",
		description:
			"Capstone projects co-created with hiring partners to demonstrate job-ready skills.",
		icon: "build",
	},
];

export const courses: Course[] = [
	{
		id: 1,
		title: "Full-Stack Web Foundations",
		category: "Software Engineering",
		level: "Beginner",
		duration: "12 weeks",
		highlights: [
			"HTML, CSS, JavaScript fundamentals",
			"Modern React patterns",
			"Deployment pipelines",
		],
	},
	{
		id: 2,
		title: "AI Product Studio",
		category: "Data & AI",
		level: "Intermediate",
		duration: "10 weeks",
		highlights: [
			"Applied machine learning",
			"Prompt engineering",
			"Responsible AI principles",
		],
	},
	{
		id: 3,
		title: "Product Strategy Sprint",
		category: "Product & Leadership",
		level: "Advanced",
		duration: "6 weeks",
		highlights: [
			"Roadmapping and OKRs",
			"Stakeholder storytelling",
			"Experiment design",
		],
	},
];

export const mentors: Mentor[] = [
	{
		id: 1,
		name: "Ava Rodriguez",
		role: "Principal Engineer",
		company: "NovaStack",
		bio: "15 years building developer platforms and leading distributed teams.",
		avatar: "https://i.pravatar.cc/300?img=1",
	},
	{
		id: 2,
		name: "Ravi Narayanan",
		role: "Head of Data Science",
		company: "Insight Labs",
		bio: "Designs AI systems that power personalization for millions of users.",
		avatar: "https://i.pravatar.cc/300?img=12",
	},
	{
		id: 3,
		name: "Maya Chen",
		role: "Product Director",
		company: "Atlas Learning",
		bio: "Former educator turned product leader focused on equitable access to tech careers.",
		avatar: "https://i.pravatar.cc/300?img=32",
	},
];

export const testimonials: Testimonial[] = [
	{
		id: 1,
		quote:
			"The mentorship and career support at NovaLearn helped me land my first product role in under 90 days.",
		name: "Jordan Blake",
		role: "Associate Product Manager, Flux AI",
	},
	{
		id: 2,
		quote:
			"Project-based learning finally made complex ML concepts stick. The portfolio I built here speaks for itself.",
		name: "Evelyn Park",
		role: "Machine Learning Engineer, LumenCloud",
	},
];

export const stats: Stat[] = [
	{
		id: 1,
		label: "Partners with school",
		value: "50+",
		detail: "Across Nepal",
	},
	{
		id: 2,
		label: "Students trained",
		value: "25k+",
		detail: "from schools to colleges",
	},
	{
		id: 3,
		label: "Project Completed",
		value: "80+",
		detail: "custom STEM kits and solutions",
	},
	{
		id: 4,
		label: "Certified Teachers",
		value: "100+",
		detail: "trained and certified",
	},
];

export const partnerLogos = [
	"https://dummyimage.com/120x40/111/fff&text=Notion",
	"https://dummyimage.com/120x40/111/fff&text=Spotify",
	"https://dummyimage.com/120x40/111/fff&text=Shopify",
	"https://dummyimage.com/120x40/111/fff&text=Canva",
	"https://dummyimage.com/120x40/111/fff&text=Coinbase",
];

export const galleryItems: GalleryItem[] = [
	{
		id: 1,
		title: "Collaborative Workspace",
		description: "Open floor plan designed for team synergy and impromptu brainstorming sessions.",
		image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800",
		category: "Office",
	},
	{
		id: 2,
		title: "Design Sprint Workshop",
		description: "Cross-functional teams coming together to solve complex user problems in real-time.",
		image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800",
		category: "Culture",
	},
	{
		id: 3,
		title: "Annual Tech Summit",
		description: "Highlights from our yearly conference bringing together industry leaders.",
		image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800",
		category: "Events",
	},
	{
		id: 4,
		title: "Mentorship Session",
		description: "One-on-one guidance helping junior developers level up their skills.",
		image: "https://images.unsplash.com/photo-1515168816178-54e7c7823336?auto=format&fit=crop&q=80&w=800",
		category: "Community",
	},
	{
		id: 5,
		title: "Product Launch",
		description: "Celebrating the release of our latest core features with the whole team.",
		image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800",
		category: "Events",
	},
	{
		id: 6,
		title: "Remote Team Retreat",
		description: "Building bonds and recharging in nature during our quarterly offsite.",
		image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
		category: "Culture",
	},
];

export const blogPosts: BlogPost[] = [
	{
		id: 1,
		title: "How to accelerate your portfolio with experience sprints",
		excerpt:
			"Ship faster by pairing focused build weeks with expert feedback. Here represents the playbook our learners rely on.",
		date: "Dec 18, 2025",
		readingTime: "7 min read",
		category: "Career Strategy",
		image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
		author: "Sofia Martinez",
	},
	{
		id: 2,
		title: "The five skills hiring teams expect from AI product managers",
		excerpt:
			"Product leaders share what separates high-signal candidates in the first interview.",
		date: "Nov 30, 2025",
		readingTime: "5 min read",
		category: "AI & Product",
		image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=800",
		author: "James Chen",
	},
	{
		id: 3,
		title: "Measuring learning outcomes beyond completion rates",
		excerpt:
			"A framework to connect learning analytics with the business and career metrics that matter.",
		date: "Oct 22, 2025",
		readingTime: "8 min read",
		category: "Learning Science",
		image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
		author: "Elena Rossi",
	},
	{
		id: 4,
		title: "Design systems for scaling teams",
		excerpt:
			"How to maintain consistency without stifling creativity as your design team grows.",
		date: "Oct 15, 2025",
		readingTime: "6 min read",
		category: "Design",
		image: "https://images.unsplash.com/photo-1586717791821-3f44a5638d48?auto=format&fit=crop&q=80&w=800",
		author: "Marcus Johnson",
	},
	{
		id: 5,
		title: "The future of remote collaboration",
		excerpt:
			"Tools and techniques that are reshaping how distributed teams build together.",
		date: "Sep 28, 2025",
		readingTime: "5 min read",
		category: "Remote Work",
		image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800",
		author: "Sarah Wu",
	},
	{
		id: 6,
		title: "Building accessible web applications",
		excerpt:
			"Practical guide to WCAG compliance and inclusive design patterns.",
		date: "Sep 10, 2025",
		readingTime: "9 min read",
		category: "Development",
		image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
		author: "David Park",
	},
];

export const ourServices = [
  {
    id: "stem-education",
    title: "STEM Education Solutions",
    tagline: "Certified. Experiential. Future-Ready.",
    description: "A globally aligned STEM education framework designed for students and teachers, rooted in hands-on learning, real-world problem solving, and measurable outcomes.",
    overview: "A globally aligned STEM education framework designed for students and teachers, rooted in hands-on learning, real-world problem solving, and measurable outcomes.",
    icon: "microscope",
    scopeOfServices: [
      "Certified STEM programs for students",
      "Certified STEM Teacher Training Programs", 
      "Robotics, electronics, AI, and coding curriculum",
      "Project-based and experiential learning models"
    ],
    impact: [
        "Develops critical thinking and innovation skills",
        "Prepares learners for future careers",
        "Elevates institutional academic standards"
    ]
  },
  {
    id: "product-engineering",
    title: "Product Engineering & Development", 
    tagline: "Research-Driven. In-House. Cost-Optimized.",
    description: "End-to-end product engineering services combining in-house STEM kit development with customized engineering solutions for schools and institutions.",
    overview: "End-to-end product engineering services combining in-house STEM kit development with customized engineering solutions for schools and institutions.",
    icon: "chip",
    scopeOfServices: [
      "In-house engineered STEM kits",
      "Research and prototype development",
      "Customized product engineering",
      "Affordable, scalable solution design"
    ],
    impact: [
        "Reduces costs without compromising quality",
        "Enables curriculum-aligned solutions",
        "Strengthens local innovation ecosystems"
    ]
  },
  {
    id: "stem-lab-setup",
    title: "STEM Lab Setup",
    tagline: "Where Learning Becomes Experience.",
    description: "A complete STEM lab design and implementation service that transforms classrooms into interactive, future-ready learning environments.",
    overview: "A complete STEM lab design and implementation service that transforms classrooms into interactive, future-ready learning environments.",
    icon: "lab", 
    scopeOfServices: [
      "Customizable STEM labs based on grade and curriculum",
      "Affordable and scalable lab infrastructure",
      "Installation, setup, and deployment",
      "Teacher orientation and lab training"
    ],
    impact: [
        "Enhances learning through visualization and experimentation",
        "Increases student engagement and retention",
        "Empowers teachers with modern tools"
    ]
  },
  {
    id: "institutional-programs",
    title: "Government, NGO & CSR Programs",
    tagline: "Scalable Impact. Measurable Outcomes.",
    description: "Large-scale STEM implementation programs designed for governments, NGOs, INGOs, and CSR partners aligned with national and global development goals.",
    overview: "Large-scale STEM implementation programs designed for governments, NGOs, INGOs, and CSR partners aligned with national and global development goals.",
    icon: "code", 
    scopeOfServices: [
      "Nationwide and regional STEM programs",
      "Teacher capacity building initiatives",
      "Monitoring, evaluation, and reporting",
      "Inclusive and community-focused interventions"
    ],
    impact: [
        "Strengthens education systems",
        "Builds workforce readiness",
        "Drives long-term socio-economic impact"
    ]
  }
];

export const servicesPageData = {
    header: {
        title: "Services That Build the Future",
        subtitle: "Certified STEM Education · Engineering · Innovation Infrastructure",
        description: "We design and deliver globally aligned STEM education, product engineering, and lab infrastructure solutions that empower institutions, educators, and learners to thrive in a technology-driven world."
    },
    recognizedBy: [
        "Kathmandu University"
    ],
    whyChooseUs: [
        "Only STEM education provider in Nepal recognized by Kathmandu University",
        "Integrated ecosystem: Education + Engineering + Infrastructure",
        "In-house R&D and product design",
        "Certified programs for teachers and students",
        "Customizable, affordable, and scalable solutions"
    ],
    ourImpact: "We don’t deliver services — we build ecosystems that enable innovation, empower educators, and prepare future leaders."
};

export const ourApproach = [
  "Requirement analysis and planning",
  "Design and development", 
  "Testing and quality assurance",
  "Deployment and ongoing support"
];

export const qualityCommitments = [
  "Compliance with international development standards",
  "Focus on security, scalability, and performance",
  "Transparent communication and documentation",
  "Long-term support and partnership"
];

export const servicePackages: Service[] = [
	{
		id: 1,
		title: "Emerging Talent Labs",
		description:
			"Launch new talent pipelines with custom cohorts, real products, and mentors drawn from your teams.",
		outcomes: [
			"Project briefs aligned to your roadmap",
			"Portfolio-ready case studies",
			"Hiring-ready graduates in 12 weeks",
		],
	},
	{
		id: 2,
		title: "Upskill Accelerators",
		description:
			"Reskill internal teams with modular pathways and live coaching that flex around busy schedules.",
		outcomes: [
			"Role-based skill diagnostics",
			"Mentored labs and simulations",
			"Success reporting and impact dashboards",
		],
	},
	{
		id: 3,
		title: "Leadership Studios",
		description:
			"Equip emerging leaders with coaching, stakeholder storytelling, and decision-making frameworks.",
		outcomes: [
			"Peer masterminds and coaching pods",
			"Executive simulations",
			"Quarterly impact showcases",
		],
	},
];

export const teamMembers: TeamMember[] = [
	{
		id: 1,
		name: "Sofia Martinez",
		title: "Co-founder & CEO",
		focus: "Learner experience and partnerships",
		bio: "Former head of product at two ed-tech unicorns, Sofia leads the NovaLearn vision and partner ecosystem.",
	},
	{
		id: 2,
		name: "Kenji Tanaka",
		title: "Co-founder & CTO",
		focus: "Platform intelligence and learning science",
		bio: "Kenji built adaptive learning systems at scale and now shapes our AI-first roadmap.",
	},
	{
		id: 3,
		name: "Amelia Brooks",
		title: "VP of Mentor Success",
		focus: "Mentor network and quality",
		bio: "Amelia curates a mentor network that spans 14 countries and keeps expertise razor sharp.",
	},
	{
		id: 4,
		name: "Luis Delgado",
		title: "Head of Learner Outcomes",
		focus: "Career services and analytics",
		bio: "Luis partners with employers and tracks outcomes to make sure learners win the jobs they want.",
	},
];

