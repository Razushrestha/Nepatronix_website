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
	rating?: number;
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
      whatsapp: "https://wa.me/9779803661701?text=Hello%20Nepatronix!%20I%20am%20interested%20in%20learning%20more%20about%20your%20IoT%20and%20Robotics%20training%20programs.%20Please%20share%20more%20details.",
      linkedin: "https://www.linkedin.com/in/razu-shrestha-1a732024b/"
    }
  },
  verticals: [
    {
      title: "STEM Innovation Nepal",
      tagline: "Education & Talent",
      description: "Empowering schools and colleges with hands-on STEM kits, teacher training, and future-ready IoT and robotics curriculum.",
      icon: "education",
    },
    {
      title: "Meta-Tronix",
      tagline: "Products & Engineering",
      description: "Designing and building large-scale software and websites from concept to market-ready products.",
      icon: "code",
    },
    {
      title: "Nepatronix Research and Development",
      tagline: "Research & Innovation",
      description: "Driving deep-tech research in IoT, robotics, and automation to solve real-world engineering challenges in Nepal and beyond.",
      icon: "research",
    }
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
		quote: "One of the best IoT, Robotics and automation companies in Nepal. They provide excellent knowledge and support to students.",
		name: "Razu Shrestha",
		role: "Google Review · Local Guide",
		rating: 5,
	},
	{
		id: 2,
		quote: "I attended the 3-day online IoT and Robotics course conducted by Nepatronix, and it was a highly valuable learning experience. The tutors were knowledgeable, supportive, and encouraged interactive participation throughout the sessions.",
		name: "Sunil Magar",
		role: "Student · Google Review",
		rating: 5,
	},
	{
		id: 3,
		quote: "I had a great experience attending the 3-day Online IoT and Robotics Course by Nepatronix. The course was beginner-friendly, practical, and packed with hands-on projects. The instructor was very knowledgeable, friendly, and supportive.",
		name: "Yubraj Shahi",
		role: "Student · Google Review",
		rating: 5,
	},
	{
		id: 4,
		quote: "I'm really happy with my experience at Nepatronix Engineering Solutions! As a student learning Arduino and ESP32 projects, I've gone from knowing nothing to an intermediate level. The teachers are great and make learning fun and easy. I highly recommend this IoT and Robotics course!",
		name: "Dishesh Mahato",
		role: "Student · Google Review",
		rating: 5,
	},
	{
		id: 5,
		quote: "Nepatronix is a burgeoning technology company based in Nepal, specializing in the development of Internet of Things (IoT) solutions and innovative hardware devices. The company is known for its commitment to creating high-end automation and instrumentation products for local and global markets.",
		name: "Jyoti Shrestha",
		role: "Google Review",
		rating: 5,
	},
	{
		id: 6,
		quote: "NepaTronix has impressed me with their innovative IoT solutions, seamlessly integrating high-performance hardware and software to meet our specific needs. Their commitment to continuous improvement and customer satisfaction sets them apart from other companies in the industry.",
		name: "Deepsu Gautam",
		role: "Client · Google Review",
		rating: 5,
	},
	{
		id: 7,
		quote: "My recent visit to Nepatronix left a lasting impression. Their pad vending machine, a blend of innovation and empathy, showcased their commitment to community welfare. What truly stood out was their dedication to education through IoT.",
		name: "Public Debt Management Office",
		role: "Tripureshwor · Google Review",
		rating: 5,
	},
	{
		id: 8,
		quote: "Best known for IoT development including Robotics and Automation in Nepal. Also provides excellent knowledge and support to students and enthusiasts.",
		name: "Bikram Karki",
		role: "Google Review",
		rating: 5,
	},
	{
		id: 9,
		quote: "Nepatronix excels in IoT and robotics, offering innovative, scalable solutions that enhance operational efficiency across various industries.",
		name: "Bikash Rashaili",
		role: "Client · Google Review",
		rating: 5,
	},
	{
		id: 10,
		quote: "Nepatronix is the best platform for students to get introduced to the IT world. Experts from the industry are there for support.",
		name: "Siddhartha Yadav",
		role: "Student · Google Review",
		rating: 5,
	},
	{
		id: 11,
		quote: "Nepatronix is the best place for learning IoT, robotics, and manufacturing IoT products. They are the best at what they do!",
		name: "Manu Shrestha",
		role: "Student · Google Review",
		rating: 5,
	},
	{
		id: 12,
		quote: "A talented team that provides top-notch robotics and IoT solutions. You can go for this company's services without a doubt.",
		name: "Namuna Paudel",
		role: "Google Review",
		rating: 5,
	},
	{
		id: 13,
		quote: "Top-notch IoT course in Kathmandu offering a welcoming atmosphere and supportive instructors.",
		name: "Sakar Khatri",
		role: "Student · Google Review",
		rating: 5,
	},
	{
		id: 14,
		quote: "Outstanding service and unmatched support — thank you, Nepatronix!",
		name: "Udit Yadav",
		role: "Google Review",
		rating: 5,
	},
	{
		id: 15,
		quote: "One of the leading IoT and Robotics companies in Nepal.",
		name: "Saroj Chaudhary",
		role: "Google Review",
		rating: 5,
	},
	{
		id: 16,
		quote: "Got a great experience learning with the Nepatronix team.",
		name: "Ayush Gupta",
		role: "Student · Google Review",
		rating: 5,
	},
	{
		id: 17,
		quote: "It was a very useful and helpful experience. Excellent.",
		name: "Maruf Alam",
		role: "Google Review",
		rating: 5,
	},
	{
		id: 18,
		quote: "One of the best IoT platforms.",
		name: "Ashok Yadav",
		role: "Google Review",
		rating: 5,
	},
	{
		id: 19,
		quote: "Best place for STEAM kits.",
		name: "Arun Lohar",
		role: "Google Review",
		rating: 5,
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
		value: "100+",
		detail: "IoT & robotics builds",
	},
	{
		id: 4,
		label: "Expert Mentors",
		value: "15+",
		detail: "Industry practitioners",
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
    title: "Certified STEM Education Solution",
    tagline: "Certified. Experiential. Future-Ready.",
    description: "A globally aligned STEM education framework designed for students and teachers, rooted in hands-on learning, real-world problem solving, and measurable outcomes.",
    overview: "A globally aligned STEM education framework designed for students and teachers, rooted in hands-on learning, real-world problem solving, and measurable outcomes.",
    icon: "microscope",
    programGoal: "To equip aspiring and practicing tutors with essential technical, pedagogical, professional, and business skills to deliver high-quality, hands-on STEM, IoT, and Robotics education in schools. while building structured, accountable, and financially sustainable tutoring programs that integrate Science experiments and Math applications effectively.",
    keyObjectives: [
      "Understand and Advocate for STEM Education",
      "Master Technical Fundamentals in Hardware and Programming",
      "Develop Hands-On Project Implementation Skills",
      "Apply Effective Pedagogical and Classroom Management Techniques",
      "Ensure Professionalism, Ethics, and Institutional Alignment",
      "Build Financial and Operational Sustainability Knowledge",
      "Acquire Skills for School Engagement and Business Development",
      "Integrate Science and Math Seamlessly into STEM Delivery",
      "Achieve Certification and Continuous Improvement"
    ],
    targetAudiance: [
      "School Teachers",
      "Engineering Students",
      "Education Entrepreneurs",
      "STEM Enthusiasts",
      "Academic Coordinators"
    ],
    certifications: [
      { name: "STEM Based Teacher Training Program", hrs: "61", delivery: "Online/Offline", exam: "Online/Offline" },
      { name: "10 Days STEM Based Workshop Program", hrs: "35", delivery: "Offline", exam: "Online/Offline" },
      { name: "7 Days STEM Based Workshop Program", hrs: "35", delivery: "Offline", exam: "Online/Offline" },
      { name: "STEM Based In-House Training Program (45 days)", hrs: "45", delivery: "Offline", exam: "Online" },
      { name: "STEM based In-House Training program (60 days)", hrs: "60", delivery: "Offline", exam: "Online" }
    ],
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
    icon: "wrench",
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
    overview: "We provide end-to-end STEM lab establishment solutions, from conceptual design and physical infrastructure to the deployment of advanced hardware and pedagogical tools. Our setups are engineered to be modular, scalable, and fully aligned with both local and international academic standards.",
    icon: "lab", 
    labTiers: [
      {
        name: "Normal Lab Setup",
        focus: "Foundational STEM & Electronics",
        description: "Essential tools and workbench setups for basic electronics, circuit building, and introductory robotics.",
        features: ["Basic STEM Kits", "Soldering Stations", "Analog Circuit Boards", "Standard Workbench Setup"]
      },
      {
        name: "Medium Lab Setup",
        focus: "Intermediate Robotics & IoT",
        description: "Advanced workstations including microcontroller development hubs, 3D printing stations, and IoT sensor arrays.",
        features: ["Advanced Robotics Kits", "FDM 3D Printers", "IoT Hub Integration", "Modular Storage Systems"]
      },
      {
        name: "High-End Lab Setup",
        focus: "Industrial AI & Prototyping",
        description: "Comprehensive innovation hubs featuring industrial-grade 3D printers, AI processing clusters, and advanced PCB milling.",
        features: ["Industrial 3D Printers", "AI/ML Workstations", "PCB Milling Machines", "VR/AR Simulation Zones"]
      }
    ],
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

