module.exports = [
"[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/app/data.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "aboutUsData",
    ()=>aboutUsData,
    "blogPosts",
    ()=>blogPosts,
    "courses",
    ()=>courses,
    "features",
    ()=>features,
    "galleryItems",
    ()=>galleryItems,
    "mentors",
    ()=>mentors,
    "ourApproach",
    ()=>ourApproach,
    "ourServices",
    ()=>ourServices,
    "partnerLogos",
    ()=>partnerLogos,
    "qualityCommitments",
    ()=>qualityCommitments,
    "servicePackages",
    ()=>servicePackages,
    "servicesPageData",
    ()=>servicesPageData,
    "stats",
    ()=>stats,
    "teamMembers",
    ()=>teamMembers,
    "testimonials",
    ()=>testimonials
]);
const aboutUsData = {
    about: "Nepatronix is a premier technology and education provider in Nepal, dedicated to bridging the gap between academia and industry. We specialize in reducing the dependency on imported electronics by fostering local innovation and manufacturing capability.",
    mission: "To revolutionize the technological landscape of Nepal by empowering youth with industry-relevant skills and promoting indigenous product development.",
    vision: "To be the leading catalyst in Nepal's journey towards technological self-sufficiency and innovation.",
    ceo: {
        name: "Razu Shrestha",
        role: "CEO and Founder",
        message: "At Nepatronix, we are committed to building a future where innovation, education, and engineering come together to create real-world impact. Our focus is on empowering students, educators, and industries through practical STEM education, advanced technology solutions, and globally aligned engineering services while staying rooted in Nepal’s needs and values. We believe in long-term thinking, ethical innovation, and meaningful collaboration as we grow from a national leader to a global technology partner. Our mission is simple: to transform ideas into impactful solutions that shape the future.",
        image: "/Raju%20Shrestha.jpg",
        socials: {
            facebook: "https://www.facebook.com/razu.shrestha.226563",
            whatsapp: "https://wa.me/9779803661701",
            linkedin: "https://www.linkedin.com/in/razu-shrestha-1a732024b/"
        }
    },
    verticals: [
        {
            title: "Innovator",
            description: "Providing STEM kits and training modules for schools and colleges."
        },
        {
            title: "Nep STEM",
            description: "Research and development solutions for local industries."
        },
        {
            title: "R&D",
            description: "End-to-end product design, prototyping, and manufacturing."
        },
        {
            title: "KMS",
            description: "Vocational training and workshops for aspiring engineers."
        }
    ],
    whyChooseUs: [
        {
            title: "Local Expertise",
            description: "Deep understanding of the local market and technological challenges."
        },
        {
            title: "Industry-Ready Training",
            description: "Curriculum designed by practicing engineers and industry veterans."
        },
        {
            title: "Innovation Focus",
            description: "Commitment to R&D and creating novel solutions."
        },
        {
            title: "End-to-End Support",
            description: "From initial concept to final product, we guide you through every step."
        },
        {
            title: "Expert Team",
            description: "Led by a team of passionate engineers and educators."
        },
        {
            title: "Proven Track Record",
            description: "Succcessful collaborations with top institutions and industries."
        }
    ]
};
const features = [
    {
        id: 1,
        title: "Personalized Learning Paths",
        description: "Adaptive curricula and AI-powered study planners that evolve with every learner.",
        icon: "target"
    },
    {
        id: 2,
        title: "Mentorship at Scale",
        description: "Weekly live sessions with industry experts, featuring feedback loops and project reviews.",
        icon: "mentor"
    },
    {
        id: 3,
        title: "Career Launchpad",
        description: "Interview prep, portfolio showcases, and employer matchmaking built into the platform.",
        icon: "launch"
    },
    {
        id: 4,
        title: "Real-World Projects",
        description: "Capstone projects co-created with hiring partners to demonstrate job-ready skills.",
        icon: "build"
    }
];
const courses = [
    {
        id: 1,
        title: "Full-Stack Web Foundations",
        category: "Software Engineering",
        level: "Beginner",
        duration: "12 weeks",
        highlights: [
            "HTML, CSS, JavaScript fundamentals",
            "Modern React patterns",
            "Deployment pipelines"
        ]
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
            "Responsible AI principles"
        ]
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
            "Experiment design"
        ]
    }
];
const mentors = [
    {
        id: 1,
        name: "Ava Rodriguez",
        role: "Principal Engineer",
        company: "NovaStack",
        bio: "15 years building developer platforms and leading distributed teams.",
        avatar: "https://i.pravatar.cc/300?img=1"
    },
    {
        id: 2,
        name: "Ravi Narayanan",
        role: "Head of Data Science",
        company: "Insight Labs",
        bio: "Designs AI systems that power personalization for millions of users.",
        avatar: "https://i.pravatar.cc/300?img=12"
    },
    {
        id: 3,
        name: "Maya Chen",
        role: "Product Director",
        company: "Atlas Learning",
        bio: "Former educator turned product leader focused on equitable access to tech careers.",
        avatar: "https://i.pravatar.cc/300?img=32"
    }
];
const testimonials = [
    {
        id: 1,
        quote: "The mentorship and career support at NovaLearn helped me land my first product role in under 90 days.",
        name: "Jordan Blake",
        role: "Associate Product Manager, Flux AI"
    },
    {
        id: 2,
        quote: "Project-based learning finally made complex ML concepts stick. The portfolio I built here speaks for itself.",
        name: "Evelyn Park",
        role: "Machine Learning Engineer, LumenCloud"
    }
];
const stats = [
    {
        id: 1,
        label: "Partners with school",
        value: "50+",
        detail: "Across Nepal"
    },
    {
        id: 2,
        label: "Students trained",
        value: "25k+",
        detail: "from schools to colleges"
    },
    {
        id: 3,
        label: "Project Completed",
        value: "80+",
        detail: "custom STEM kits and solutions"
    },
    {
        id: 4,
        label: "Certified Teachers",
        value: "100+",
        detail: "trained and certified"
    }
];
const partnerLogos = [
    "https://dummyimage.com/120x40/111/fff&text=Notion",
    "https://dummyimage.com/120x40/111/fff&text=Spotify",
    "https://dummyimage.com/120x40/111/fff&text=Shopify",
    "https://dummyimage.com/120x40/111/fff&text=Canva",
    "https://dummyimage.com/120x40/111/fff&text=Coinbase"
];
const galleryItems = [
    {
        id: 1,
        title: "Collaborative Workspace",
        description: "Open floor plan designed for team synergy and impromptu brainstorming sessions.",
        image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800",
        category: "Office"
    },
    {
        id: 2,
        title: "Design Sprint Workshop",
        description: "Cross-functional teams coming together to solve complex user problems in real-time.",
        image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800",
        category: "Culture"
    },
    {
        id: 3,
        title: "Annual Tech Summit",
        description: "Highlights from our yearly conference bringing together industry leaders.",
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800",
        category: "Events"
    },
    {
        id: 4,
        title: "Mentorship Session",
        description: "One-on-one guidance helping junior developers level up their skills.",
        image: "https://images.unsplash.com/photo-1515168816178-54e7c7823336?auto=format&fit=crop&q=80&w=800",
        category: "Community"
    },
    {
        id: 5,
        title: "Product Launch",
        description: "Celebrating the release of our latest core features with the whole team.",
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800",
        category: "Events"
    },
    {
        id: 6,
        title: "Remote Team Retreat",
        description: "Building bonds and recharging in nature during our quarterly offsite.",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
        category: "Culture"
    }
];
const blogPosts = [
    {
        id: 1,
        title: "How to accelerate your portfolio with experience sprints",
        excerpt: "Ship faster by pairing focused build weeks with expert feedback. Here represents the playbook our learners rely on.",
        date: "Dec 18, 2025",
        readingTime: "7 min read",
        category: "Career Strategy",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
        author: "Sofia Martinez"
    },
    {
        id: 2,
        title: "The five skills hiring teams expect from AI product managers",
        excerpt: "Product leaders share what separates high-signal candidates in the first interview.",
        date: "Nov 30, 2025",
        readingTime: "5 min read",
        category: "AI & Product",
        image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=800",
        author: "James Chen"
    },
    {
        id: 3,
        title: "Measuring learning outcomes beyond completion rates",
        excerpt: "A framework to connect learning analytics with the business and career metrics that matter.",
        date: "Oct 22, 2025",
        readingTime: "8 min read",
        category: "Learning Science",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
        author: "Elena Rossi"
    },
    {
        id: 4,
        title: "Design systems for scaling teams",
        excerpt: "How to maintain consistency without stifling creativity as your design team grows.",
        date: "Oct 15, 2025",
        readingTime: "6 min read",
        category: "Design",
        image: "https://images.unsplash.com/photo-1586717791821-3f44a5638d48?auto=format&fit=crop&q=80&w=800",
        author: "Marcus Johnson"
    },
    {
        id: 5,
        title: "The future of remote collaboration",
        excerpt: "Tools and techniques that are reshaping how distributed teams build together.",
        date: "Sep 28, 2025",
        readingTime: "5 min read",
        category: "Remote Work",
        image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800",
        author: "Sarah Wu"
    },
    {
        id: 6,
        title: "Building accessible web applications",
        excerpt: "Practical guide to WCAG compliance and inclusive design patterns.",
        date: "Sep 10, 2025",
        readingTime: "9 min read",
        category: "Development",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
        author: "David Park"
    }
];
const ourServices = [
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
const servicesPageData = {
    header: {
        title: "Services That Build the Future",
        subtitle: "Certified STEM Education · Engineering · Innovation Infrastructure",
        description: "We design and deliver globally aligned STEM education, product engineering, and lab infrastructure solutions that empower institutions, educators, and learners to thrive in a technology-driven world."
    },
    recognizedBy: [
        "IIT Madras",
        "IIT Madras Pravartak",
        "Kathmandu University"
    ],
    whyChooseUs: [
        "Only STEM education provider in Nepal recognized by IIT Madras, IIT Madras Pravartak, and Kathmandu University",
        "Integrated ecosystem: Education + Engineering + Infrastructure",
        "In-house R&D and product design",
        "Certified programs for teachers and students",
        "Customizable, affordable, and scalable solutions"
    ],
    ourImpact: "We don’t deliver services — we build ecosystems that enable innovation, empower educators, and prepare future leaders."
};
const ourApproach = [
    "Requirement analysis and planning",
    "Design and development",
    "Testing and quality assurance",
    "Deployment and ongoing support"
];
const qualityCommitments = [
    "Compliance with international development standards",
    "Focus on security, scalability, and performance",
    "Transparent communication and documentation",
    "Long-term support and partnership"
];
const servicePackages = [
    {
        id: 1,
        title: "Emerging Talent Labs",
        description: "Launch new talent pipelines with custom cohorts, real products, and mentors drawn from your teams.",
        outcomes: [
            "Project briefs aligned to your roadmap",
            "Portfolio-ready case studies",
            "Hiring-ready graduates in 12 weeks"
        ]
    },
    {
        id: 2,
        title: "Upskill Accelerators",
        description: "Reskill internal teams with modular pathways and live coaching that flex around busy schedules.",
        outcomes: [
            "Role-based skill diagnostics",
            "Mentored labs and simulations",
            "Success reporting and impact dashboards"
        ]
    },
    {
        id: 3,
        title: "Leadership Studios",
        description: "Equip emerging leaders with coaching, stakeholder storytelling, and decision-making frameworks.",
        outcomes: [
            "Peer masterminds and coaching pods",
            "Executive simulations",
            "Quarterly impact showcases"
        ]
    }
];
const teamMembers = [
    {
        id: 1,
        name: "Sofia Martinez",
        title: "Co-founder & CEO",
        focus: "Learner experience and partnerships",
        bio: "Former head of product at two ed-tech unicorns, Sofia leads the NovaLearn vision and partner ecosystem."
    },
    {
        id: 2,
        name: "Kenji Tanaka",
        title: "Co-founder & CTO",
        focus: "Platform intelligence and learning science",
        bio: "Kenji built adaptive learning systems at scale and now shapes our AI-first roadmap."
    },
    {
        id: 3,
        name: "Amelia Brooks",
        title: "VP of Mentor Success",
        focus: "Mentor network and quality",
        bio: "Amelia curates a mentor network that spans 14 countries and keeps expertise razor sharp."
    },
    {
        id: 4,
        name: "Luis Delgado",
        title: "Head of Learner Outcomes",
        focus: "Career services and analytics",
        bio: "Luis partners with employers and tracks outcomes to make sure learners win the jobs they want."
    }
];
}),
"[project]/app/components/SectionHeading.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SectionHeading",
    ()=>SectionHeading
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
;
function SectionHeading({ eyebrow, title, description, align = "left" }) {
    const alignment = align === "center" ? "items-center text-center" : "items-start text-left";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex flex-col gap-3 ${alignment}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-xs font-semibold uppercase tracking-[0.4em] text-[#0a3d62]",
                children: eyebrow
            }, void 0, false, {
                fileName: "[project]/app/components/SectionHeading.tsx",
                lineNumber: 13,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-2xl font-semibold text-[#1f2933] sm:text-3xl",
                children: title
            }, void 0, false, {
                fileName: "[project]/app/components/SectionHeading.tsx",
                lineNumber: 16,
                columnNumber: 7
            }, this),
            description ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "max-w-2xl text-sm text-subtle sm:text-base",
                children: description
            }, void 0, false, {
                fileName: "[project]/app/components/SectionHeading.tsx",
                lineNumber: 18,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/SectionHeading.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/components/SchoolCollaborations.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/app/components/SchoolCollaborations.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/components/SchoolCollaborations.tsx <module evaluation>", "default");
}),
"[project]/app/components/SchoolCollaborations.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/app/components/SchoolCollaborations.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/components/SchoolCollaborations.tsx", "default");
}),
"[project]/app/components/SchoolCollaborations.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SchoolCollaborations$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/app/components/SchoolCollaborations.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SchoolCollaborations$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/app/components/SchoolCollaborations.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SchoolCollaborations$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/app/components/StatsBar.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StatsBar",
    ()=>StatsBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
;
function StatsBar({ stats }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid gap-6 rounded-3xl border border-[#e3f2fd] surface-card p-8 shadow-sm sm:grid-cols-2 lg:grid-cols-4",
        children: stats.map((stat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-1 items-center text-center sm:items-start sm:text-left",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-3xl font-semibold text-[#1f2933]",
                        children: stat.value
                    }, void 0, false, {
                        fileName: "[project]/app/components/StatsBar.tsx",
                        lineNumber: 8,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm font-medium uppercase tracking-[0.3em] text-[#0a3d62]",
                        children: stat.label
                    }, void 0, false, {
                        fileName: "[project]/app/components/StatsBar.tsx",
                        lineNumber: 9,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm text-[#6B7280]",
                        children: stat.detail
                    }, void 0, false, {
                        fileName: "[project]/app/components/StatsBar.tsx",
                        lineNumber: 12,
                        columnNumber: 11
                    }, this)
                ]
            }, stat.id, true, {
                fileName: "[project]/app/components/StatsBar.tsx",
                lineNumber: 7,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/app/components/StatsBar.tsx",
        lineNumber: 5,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/components/HeroSection.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HeroSection",
    ()=>HeroSection
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const HeroSection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call HeroSection() from the server but HeroSection is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/components/HeroSection.tsx <module evaluation>", "HeroSection");
}),
"[project]/app/components/HeroSection.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HeroSection",
    ()=>HeroSection
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const HeroSection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call HeroSection() from the server but HeroSection is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/components/HeroSection.tsx", "HeroSection");
}),
"[project]/app/components/HeroSection.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$HeroSection$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/app/components/HeroSection.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$HeroSection$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/app/components/HeroSection.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$HeroSection$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/app/components/RecognitionGrid.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RecognitionGrid",
    ()=>RecognitionGrid
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const RecognitionGrid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call RecognitionGrid() from the server but RecognitionGrid is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/components/RecognitionGrid.tsx <module evaluation>", "RecognitionGrid");
}),
"[project]/app/components/RecognitionGrid.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RecognitionGrid",
    ()=>RecognitionGrid
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const RecognitionGrid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call RecognitionGrid() from the server but RecognitionGrid is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/components/RecognitionGrid.tsx", "RecognitionGrid");
}),
"[project]/app/components/RecognitionGrid.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RecognitionGrid$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/app/components/RecognitionGrid.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RecognitionGrid$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/app/components/RecognitionGrid.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RecognitionGrid$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/app/components/PartnersGrid.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PartnersGrid",
    ()=>PartnersGrid
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const PartnersGrid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call PartnersGrid() from the server but PartnersGrid is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/components/PartnersGrid.tsx <module evaluation>", "PartnersGrid");
}),
"[project]/app/components/PartnersGrid.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PartnersGrid",
    ()=>PartnersGrid
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const PartnersGrid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call PartnersGrid() from the server but PartnersGrid is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/components/PartnersGrid.tsx", "PartnersGrid");
}),
"[project]/app/components/PartnersGrid.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$PartnersGrid$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/app/components/PartnersGrid.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$PartnersGrid$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/app/components/PartnersGrid.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$PartnersGrid$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/app/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home,
    "metadata",
    ()=>metadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/data.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SectionHeading$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/SectionHeading.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SchoolCollaborations$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/SchoolCollaborations.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$StatsBar$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/StatsBar.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$HeroSection$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/HeroSection.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RecognitionGrid$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/RecognitionGrid.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$PartnersGrid$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/PartnersGrid.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
const metadata = {
    title: "IoT, Robotics & STEM Education in Nepal",
    description: " the best IoT and Robotics training institute in Nepal. Nepatronix offers expert-led workshops for schools covering Arduino, PCB Design, and Electronics."
};
function Home() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$HeroSection$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["HeroSection"], {}, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "relative -mt-10",
                id: "outcomes",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-6xl px-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$StatsBar$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StatsBar"], {
                        stats: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["stats"]
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 28,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 27,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mx-auto mt-24 max-w-6xl space-y-12 px-6",
                id: "about",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SectionHeading$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionHeading"], {
                        eyebrow: "About Us",
                        title: "Our Mission & Vision",
                        description: "Driving innovation through education and technology.",
                        align: "center"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 33,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mx-auto max-w-4xl text-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xl leading-relaxed text-[#6B7280]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-semibold text-[#020617]",
                                    children: "Nepa"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 41,
                                    columnNumber: 13
                                }, this),
                                " is a leading Nepal-based IOT, STEM EdTech and software company dedicated to bridging the persistent gap between theoretical knowledge and real-world innovation. Founded in",
                                " ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-semibold text-[#2563EB]",
                                    children: "2021"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 45,
                                    columnNumber: 13
                                }, this),
                                ", the company is driven by the core belief that education should inspire creativity, cultivate practical skills, and lead to meaningful invention. As a multidisciplinary technology enterprise, NepaTronix operates across the intersections of",
                                " ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[#020617]",
                                    children: "engineering"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 50,
                                    columnNumber: 13
                                }, this),
                                ",",
                                " ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[#020617]",
                                    children: "education"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 51,
                                    columnNumber: 13
                                }, this),
                                ", and",
                                " ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[#020617]",
                                    children: "social impact"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 52,
                                    columnNumber: 13
                                }, this),
                                "—delivering smart technology solutions and engaging educational programs that empower learners of all backgrounds."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 40,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 39,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid gap-8 md:grid-cols-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-[0_4px_20px_rgba(2,6,23,0.1)] transition-all hover:border-[#020617]/20",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-4 inline-flex items-center gap-2 rounded-full bg-[#020617]/10 px-4 py-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-2xl",
                                                children: "🎯"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 60,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-semibold uppercase tracking-widest text-[#020617]",
                                                children: "Vision"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 61,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 59,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-lg leading-relaxed text-slate-700",
                                        children: "“Tech-driven learning that inspires innovation at every level.”"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 65,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 58,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-[0_4px_20px_rgba(193,18,31,0.15)] transition-all hover:border-[#C1121F]/20",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-4 inline-flex items-center gap-2 rounded-full bg-[#C1121F]/10 px-4 py-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-2xl",
                                                children: "🚀"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 72,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-semibold uppercase tracking-widest text-[#C1121F]",
                                                children: "Mission"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 73,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 71,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-lg leading-relaxed text-slate-700",
                                        children: "“To simplify and amplify IoT, STEM education through impactful tools, creative content, and innovating real-world technology.”"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 77,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 70,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mx-auto mt-24 max-w-6xl px-6",
                id: "recognition",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SectionHeading$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionHeading"], {
                            eyebrow: "Recognition",
                            title: "Trusted by Leading Institutions",
                            description: "We are proud to be recognized and supported by prestigious organizations across Nepal and India.",
                            align: "center"
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 88,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 87,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RecognitionGrid$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["RecognitionGrid"], {}, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 86,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mx-auto mt-24 max-w-6xl space-y-12 px-6",
                id: "programs",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SectionHeading$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionHeading"], {
                        eyebrow: "Certification",
                        title: "Certified and Accreditation",
                        description: "Our STEAM with IoT and Robotic course is being accredited and certified by Kathmandu University, IIT Madras and IITM Pravartak",
                        align: "center"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 103,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-16",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-8 md:grid-cols-3",
                            children: [
                                {
                                    name: "Kathmandu University",
                                    logo: "/recognition/KU.png",
                                    role: "Academic Accreditation",
                                    description: "Official university certification for our comprehensive STEAM curriculum"
                                },
                                {
                                    name: "IIT Madras",
                                    logo: "/recognition/iit_madras-removebg-preview.png",
                                    role: "Technical Validation",
                                    description: "Industry-standard validation of our IoT and robotics modules"
                                },
                                {
                                    name: "IITM Pravartak",
                                    logo: "/recognition/IITM_pravatak-removebg-preview.png",
                                    role: "Innovation Certification",
                                    description: "Startup ecosystem certification for practical project implementation"
                                }
                            ].map((partner)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col items-center rounded-2xl border border-[#e3f2fd] bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-6 flex h-24 w-full items-center justify-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                                src: partner.logo,
                                                alt: partner.name,
                                                width: 150,
                                                height: 150,
                                                className: "h-auto max-h-20 w-auto max-w-full object-contain"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 141,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 140,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "mb-2 rounded-full bg-[#1e88e5]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1e88e5]",
                                            children: partner.role
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 149,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "mb-3 text-center text-lg font-semibold text-[#1f2933]",
                                            children: partner.name
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 152,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-center text-sm leading-relaxed text-[#64748b]",
                                            children: partner.description
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 155,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, partner.name, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 136,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 112,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 111,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 99,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mx-auto mt-24 max-w-6xl space-y-12 px-6",
                id: "mentors",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SectionHeading$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionHeading"], {
                        eyebrow: "Our Services",
                        title: "Comprehensive STEM Solutions",
                        description: "From education to innovation, we provide end-to-end STEM services for institutions, students, and businesses.",
                        align: "center"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 165,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid gap-8 md:grid-cols-2 lg:grid-cols-4",
                        children: [
                            {
                                name: "STEM Tutor Program",
                                icon: "🎓",
                                description: "Personalized STEM education with expert tutors for students at all levels",
                                color: "bg-[#1e88e5]/10"
                            },
                            {
                                name: "STEM Lab Setup",
                                icon: "🔬",
                                description: "Complete laboratory setup and equipment for schools and educational institutions",
                                color: "bg-[#e63946]/10"
                            },
                            {
                                name: "Software and APP Development",
                                icon: "💻",
                                description: "Custom software solutions and mobile applications for educational and business needs",
                                color: "bg-[#00b894]/10"
                            },
                            {
                                name: "Research and Innovations",
                                icon: "🚀",
                                description: "Cutting-edge research projects and innovative solutions for real-world challenges",
                                color: "bg-[#6c5ce7]/10"
                            }
                        ].map((service)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center rounded-2xl border border-[#e3f2fd] bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `mb-6 flex h-20 w-20 items-center justify-center rounded-2xl ${service.color}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-4xl",
                                            children: service.icon
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 210,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 207,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "mb-4 text-center text-lg font-semibold text-[#1f2933]",
                                        children: service.name
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 212,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-center text-sm leading-relaxed text-[#64748b]",
                                        children: service.description
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 215,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, service.name, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 203,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 172,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 164,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mx-auto mt-24 max-w-6xl space-y-12 px-6",
                id: "stories",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SectionHeading$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionHeading"], {
                        eyebrow: "Partnership Organizations",
                        title: "Trusted Partners & Collaborators",
                        description: "Building a strong ecosystem through strategic partnerships with leading organizations across technology, education, and financial sectors.",
                        align: "center"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 224,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$PartnersGrid$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PartnersGrid"], {}, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 231,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 223,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mx-auto mt-24 max-w-6xl space-y-12 px-6",
                id: "portfolio",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SectionHeading$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionHeading"], {
                        eyebrow: "Our Portfolio",
                        title: "Websites We've Built",
                        description: "Explore some of the professional websites and digital solutions we've created for our clients.",
                        align: "center"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 238,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-16 overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "animate-marquee flex gap-6",
                            children: [
                                {
                                    name: "Suryodaya Inc",
                                    url: "https://www.suryodayainc.com/"
                                },
                                {
                                    name: "EU Nepal Business Forum",
                                    url: "https://eunepalbusinessforum.eu/"
                                },
                                {
                                    name: "Campsite Nepal",
                                    url: "https://campsitenepal.com/"
                                },
                                {
                                    name: "Event Solutions",
                                    url: "https://eventsolutions.com/"
                                },
                                {
                                    name: "Karnorr",
                                    url: "https://karnorr.com/"
                                },
                                // Duplicate for seamless scroll
                                {
                                    name: "Suryodaya Inc",
                                    url: "https://www.suryodayainc.com/"
                                },
                                {
                                    name: "EU Nepal Business Forum",
                                    url: "https://eunepalbusinessforum.eu/"
                                },
                                {
                                    name: "Campsite Nepal",
                                    url: "https://campsitenepal.com/"
                                },
                                {
                                    name: "Event Solutions",
                                    url: "https://eventsolutions.com/"
                                },
                                {
                                    name: "Karnorr",
                                    url: "https://karnorr.com/"
                                }
                            ].map((project, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex w-72 flex-shrink-0 flex-col items-center rounded-xl border border-[#e3f2fd] bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-4 text-4xl",
                                            children: "🌐"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 294,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "mb-3 text-center text-lg font-semibold text-[#1f2933]",
                                            children: project.name
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 295,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: project.url,
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            className: "rounded-full bg-[#1e88e5] px-4 py-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-[#1565c0]",
                                            children: "Visit Website"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 298,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, `${project.name}-${index}`, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 290,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 246,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 245,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 234,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mx-auto mt-24 max-w-6xl space-y-12 px-6",
                id: "schools",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SectionHeading$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionHeading"], {
                        eyebrow: "Educational Partners",
                        title: "School & College Collaborations",
                        description: "Partnering with leading educational institutions to transform STEM education across Nepal and beyond.",
                        align: "center"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 313,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SchoolCollaborations$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 320,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 312,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mx-auto mt-24 mb-24 max-w-6xl space-y-12 px-6",
                id: "testimonials",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SectionHeading$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionHeading"], {
                        eyebrow: "Client Reviews",
                        title: "What Our Clients Say",
                        description: "Real feedback from our satisfied clients and partners across various projects.",
                        align: "center"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 327,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-16 overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "animate-marquee flex gap-6",
                            children: [
                                {
                                    name: "Rajesh Maharjan",
                                    role: "Principal, Kathmandu Modern School",
                                    rating: 5,
                                    review: "Nepatronix transformed our school's science lab with cutting-edge STEM equipment. Students are now more engaged in practical learning than ever before."
                                },
                                {
                                    name: "Dr. Sunita Shrestha",
                                    role: "Professor, Tribhuvan University",
                                    rating: 5,
                                    review: "The IoT training program conducted by Nepatronix was exceptional. Their expertise in modern technology education is truly remarkable."
                                },
                                {
                                    name: "Bikram Tamang",
                                    role: "IT Director, Prime College",
                                    rating: 5,
                                    review: "Professional website development with excellent customer support. Nepatronix delivered exactly what we envisioned for our institution."
                                },
                                {
                                    name: "Priya Adhikari",
                                    role: "Education Consultant",
                                    rating: 5,
                                    review: "Their STEM tutor program has significantly improved our students' performance in science and mathematics. Highly recommended service!"
                                },
                                {
                                    name: "Amit Basnet",
                                    role: "Director, Rainbow Academy",
                                    rating: 5,
                                    review: "Nepatronix helped us set up a complete digital classroom solution. The team is knowledgeable, responsive, and delivers quality work."
                                },
                                {
                                    name: "Dr. Kamala Devi",
                                    role: "Research Head, BIT",
                                    rating: 5,
                                    review: "Excellent research and innovation support. Their technical expertise helped us complete our technology project successfully and on time."
                                },
                                {
                                    name: "Santosh Gurung",
                                    role: "Principal, Marvellous School",
                                    rating: 5,
                                    review: "The mobile app development service exceeded our expectations. Clean interface, robust functionality. Outstanding work by the Nepatronix team!"
                                },
                                {
                                    name: "Renu Karki",
                                    role: "Academic Director, NCCS",
                                    rating: 5,
                                    review: "Professional team with deep understanding of educational technology needs. They delivered our learning management system exactly as promised."
                                }
                            ].concat([
                                {
                                    name: "Rajesh Maharjan",
                                    role: "Principal, Kathmandu Modern School",
                                    rating: 5,
                                    review: "Nepatronix transformed our school's science lab with cutting-edge STEM equipment. Students are now more engaged in practical learning than ever before."
                                },
                                {
                                    name: "Dr. Sunita Shrestha",
                                    role: "Professor, Tribhuvan University",
                                    rating: 5,
                                    review: "The IoT training program conducted by Nepatronix was exceptional. Their expertise in modern technology education is truly remarkable."
                                },
                                {
                                    name: "Bikram Tamang",
                                    role: "IT Director, Prime College",
                                    rating: 5,
                                    review: "Professional website development with excellent customer support. Nepatronix delivered exactly what we envisioned for our institution."
                                },
                                {
                                    name: "Priya Adhikari",
                                    role: "Education Consultant",
                                    rating: 5,
                                    review: "Their STEM tutor program has significantly improved our students' performance in science and mathematics. Highly recommended service!"
                                },
                                {
                                    name: "Amit Basnet",
                                    role: "Director, Rainbow Academy",
                                    rating: 5,
                                    review: "Nepatronix helped us set up a complete digital classroom solution. The team is knowledgeable, responsive, and delivers quality work."
                                },
                                {
                                    name: "Dr. Kamala Devi",
                                    role: "Research Head, BIT",
                                    rating: 5,
                                    review: "Excellent research and innovation support. Their technical expertise helped us complete our technology project successfully and on time."
                                }
                            ]).map((testimonial, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-80 flex-shrink-0 rounded-xl border border-[#e3f2fd] bg-white p-6 shadow-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-4 flex text-yellow-400",
                                            children: Array.from({
                                                length: testimonial.rating
                                            }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-lg",
                                                    children: "⭐"
                                                }, i, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 445,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 443,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mb-4 text-sm leading-relaxed text-[#64748b]",
                                            children: [
                                                "“",
                                                testimonial.review,
                                                "”"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 450,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "border-t border-[#e3f2fd] pt-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-semibold text-[#1f2933]",
                                                    children: testimonial.name
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 454,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-[#64748b]",
                                                    children: testimonial.role
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 457,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 453,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, `testimonial-${index}`, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 439,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 335,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 334,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 323,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__63096784._.js.map