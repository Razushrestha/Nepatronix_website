import type { ChatKnowledge, ChatMessage, ChatReply } from './types'

const GREETING =
  /\b(hi|hello|namaste|hey|hy|hlo|helo|hiii|hyy|hola|good morning|good afternoon|good evening|sup|yo)\b/i

const FOLLOW_UP =
  /\b(more|details|tell me more|yes|yeah|sure|ok|okay|continue|go on|explain|elaborate|how about that)\b/i

interface IntentMatch {
  id: string
  respond: (kb: ChatKnowledge, query: string, lastIntent?: string) => string
}

function formatCourseList(courses: ChatKnowledge['courses'], baseUrl: string, limit = 6) {
  if (!courses.length) {
    return 'Course listings are being updated. Visit our courses page for the latest programs.'
  }
  return courses
    .slice(0, limit)
    .map((c, i) => {
      const price =
        c.isFree ? 'Free' : c.price != null ? `NPR ${c.price}${c.priceUnit ? ` ${c.priceUnit}` : ''}` : 'Contact for pricing'
      const meta = [c.level, c.duration || (c.hours ? `${c.hours} hrs` : ''), c.deliveryMode, price]
        .filter(Boolean)
        .join(' · ')
      return `${i + 1}. **${c.title}**${meta ? ` (${meta})` : ''}`
    })
    .join('\n')
    .concat(`\n\nBrowse all courses: ${baseUrl}/services/courses`)
}

function formatStats(kb: ChatKnowledge) {
  return kb.stats.map((s) => `• **${s.value}** ${s.label}${s.detail ? ` — ${s.detail}` : ''}`).join('\n')
}

function formatServices(kb: ChatKnowledge) {
  return kb.services
    .map((s, i) => `${i + 1}. **${s.title}** — ${s.tagline || s.description}\n   ${s.url}`)
    .join('\n\n')
}

function formatLabTiers(kb: ChatKnowledge) {
  if (!kb.labTiers.length) return 'We design modular STEM labs for schools and colleges.'
  return kb.labTiers
    .map(
      (t) =>
        `**${t.name}** (${t.focus})\n${t.features.map((f) => `  • ${f}`).join('\n')}`
    )
    .join('\n\n')
}

function formatCertPrograms(kb: ChatKnowledge) {
  if (!kb.certifications.length) return ''
  return kb.certifications
    .slice(0, 5)
    .map((c) => `• **${c.name}** — ${c.hrs} hrs (${c.delivery})`)
    .join('\n')
}

function formatTeam(kb: ChatKnowledge) {
  if (!kb.team.length) {
    return `Meet our team at ${kb.baseUrl}/teams`
  }
  return kb.team
    .slice(0, 8)
    .map((m) => `• **${m.name}**${m.title ? ` — ${m.title}` : ''}${m.role ? ` (${m.role})` : ''}`)
    .join('\n')
    .concat(`\n\nFull team: ${kb.baseUrl}/teams`)
}

function formatBlog(kb: ChatKnowledge) {
  if (!kb.blogPosts.length) {
    return `Read our latest articles at ${kb.baseUrl}/blog`
  }
  return kb.blogPosts
    .slice(0, 4)
    .map((p) => {
      const link = p.slug ? `${kb.baseUrl}/blog/${p.slug}` : kb.baseUrl + '/blog'
      return `• **${p.title}**${p.excerpt ? `\n  ${p.excerpt.slice(0, 100)}…` : ''}\n  ${link}`
    })
    .join('\n\n')
}

function searchPages(kb: ChatKnowledge, query: string) {
  const words = query.split(/\s+/).filter((w) => w.length > 2)
  const scored = kb.pages
    .map((p) => {
      const hay = `${p.label} ${p.description} ${p.path}`.toLowerCase()
      const score = words.reduce((n, w) => (hay.includes(w) ? n + 1 : n), 0)
      return { ...p, score }
    })
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
  return scored.slice(0, 3)
}

function buildIntents(): IntentMatch[] {
  return [
    {
      id: 'greeting',
      respond: () =>
        `Namaste! I am **Mahabir**, your Nepatronix assistant.\n\nI can help with:\n• STEM courses & enrollment\n• Lab setup for schools\n• Certificates & verification\n• Contact & location\n• Our team, blog, and services\n\nWhat would you like to know?`,
    },
    {
      id: 'identity',
      respond: () =>
        `I am **Mahabir**, the AI assistant for **NepaTronix Engineering Solutions**. I answer questions about our IoT, robotics, and STEM programs using live information from our website — courses, services, contact details, certificates, and more.`,
    },
    {
      id: 'contact',
      respond: (kb) =>
        `**Contact Nepatronix**\n\n📧 Email: ${kb.contact.email}\n📞 Phone: ${kb.contact.phone}\n📍 Address: ${kb.contact.address}\n🕐 Hours: ${kb.contact.hours}\n💬 WhatsApp: ${kb.founder.whatsapp}\n\nContact form: ${kb.baseUrl}/contact`,
    },
    {
      id: 'location',
      respond: (kb) =>
        `Our office and innovation lab are in **Kupondole, Lalitpur, Nepal**. You're welcome to visit and see our STEM workshops in action.\n\n📍 ${kb.contact.address}\n🕐 ${kb.contact.hours}\n\nMap & form: ${kb.baseUrl}/contact`,
    },
    {
      id: 'certificate_apply',
      respond: (kb) =>
        `**Apply for a Certificate**\n\nIf you completed a Nepatronix training program, you can apply here:\n${kb.baseUrl}/services/apply-certificate\n\nYou'll need your course details, profile photo, and payment proof (if applicable). Our team reviews applications and issues a unique certificate UID.`,
    },
    {
      id: 'certificate_verify',
      respond: (kb) =>
        `**Verify a Certificate**\n\nEvery approved Nepatronix certificate has a unique ID (e.g. NT-YYYYMMDD-XX).\n\nVerify at: ${kb.baseUrl}/verify-certificate\n\nEnter the certificate UID to confirm authenticity.`,
    },
    {
      id: 'enrollment',
      respond: (kb) =>
        `**How to Enroll**\n\n1. Browse courses: ${kb.baseUrl}/services/courses\n2. Select a program and submit the enrollment form\n3. Our team will contact you with batch details\n\nFor upcoming batches: ${kb.baseUrl}/services/upcoming-sessions\n\nNeed help choosing? Tell me your goal (student, teacher, or school).`,
    },
    {
      id: 'courses',
      respond: (kb) => {
        let text = `**Our Training Programs**\n\n${formatCourseList(kb.courses, kb.baseUrl)}`
        if (kb.upcomingCourses.length) {
          text += `\n\n**Upcoming Sessions**\n${kb.upcomingCourses
            .slice(0, 4)
            .map((c) => `• **${c.title}**${c.sessionVenue ? ` @ ${c.sessionVenue}` : ''}`)
            .join('\n')}\n${kb.baseUrl}/services/upcoming-sessions`
        }
        return text
      },
    },
    {
      id: 'pricing',
      respond: (kb) => {
        const priced = kb.courses.filter((c) => c.price != null || c.isFree)
        if (!priced.length) {
          return `Pricing varies by program and batch size. Share your course interest and we'll quote you.\n\n📞 ${kb.contact.phone}\n📧 ${kb.contact.email}\n\nCourses: ${kb.baseUrl}/services/courses`
        }
        const lines = priced.slice(0, 6).map((c) => {
          const price = c.isFree ? 'Free' : `NPR ${c.price}${c.priceUnit ? ` ${c.priceUnit}` : ''}`
          return `• **${c.title}** — ${price}`
        })
        return `**Course Pricing (indicative)**\n\n${lines.join('\n')}\n\nFinal fees may vary by batch. Contact us for institutional quotes:\n📞 ${kb.contact.phone}`
      },
    },
    {
      id: 'lab_setup',
      respond: (kb) =>
        `**STEM Lab Setup**\n\nWe deliver turnkey lab design — infrastructure, hardware, installation, and teacher training.\n\n${formatLabTiers(kb)}\n\nLearn more: ${kb.baseUrl}/services/stem-lab-setup\n\nWant a proposal for your school? Share your grade level and student count.`,
    },
    {
      id: 'stem_education',
      respond: (kb) => {
        const certs = formatCertPrograms(kb)
        return `**Certified STEM Education**\n\nPrograms recognized by **${kb.recognizedBy.join(', ') || 'Kathmandu University'}**.\n\nHands-on robotics, electronics, IoT, AI, and coding for students and teachers.\n\n${certs ? `**Certification Programs:**\n${certs}\n\n` : ''}Details: ${kb.baseUrl}/services/stem-education`
      },
    },
    {
      id: 'product_engineering',
      respond: (kb) =>
        `**Product Engineering & R&D (Nep STEM)**\n\nIn-house PCB design, firmware, prototyping, and STEM kit development for schools and industries.\n\nWe build locally — not just import.\n\nLearn more: ${kb.baseUrl}/services/product-engineering`,
    },
    {
      id: 'institutional',
      respond: (kb) =>
        `**Government, NGO & CSR Programs**\n\nLarge-scale STEM rollouts for governments, NGOs, INGOs, and CSR partners — teacher training, monitoring, and measurable outcomes.\n\nDetails: ${kb.baseUrl}/services/institutional-programs\n\nFor partnerships, contact ${kb.contact.email}`,
    },
    {
      id: 'services',
      respond: (kb) =>
        `**Our Services**\n\n${formatServices(kb)}\n\nOverview: ${kb.baseUrl}/services`,
    },
    {
      id: 'about',
      respond: (kb) =>
        `**About Nepatronix**\n\nFounded **${kb.company.founded}** in Nepal. ${kb.company.about}\n\n**Mission:** ${kb.company.mission}\n\n**Vision:** ${kb.company.vision}\n\n**Impact:**\n${formatStats(kb)}`,
    },
    {
      id: 'founder',
      respond: (kb) =>
        `**${kb.founder.name}** — ${kb.founder.role}\n\nEstablished Nepatronix in 2021 to bridge engineering, education, and social impact in Nepal.\n\nFor major partnerships: WhatsApp **${kb.founder.whatsapp}**\n\nPartners page: ${kb.baseUrl}/partners`,
    },
    {
      id: 'team',
      respond: (kb) => `**Our Team**\n\n${formatTeam(kb)}`,
    },
    {
      id: 'blog',
      respond: (kb) => `**Latest from Our Blog**\n\n${formatBlog(kb)}`,
    },
    {
      id: 'gallery',
      respond: (kb) =>
        `**Photo Gallery**\n\nSee workshops, school collaborations, and STEM events:\n${kb.baseUrl}/image`,
    },
    {
      id: 'partners',
      respond: (kb) =>
        `**Partners & Collaborations**\n\nNepatronix works with **${kb.stats.find((s) => s.label.toLowerCase().includes('partner'))?.value || '50+'}** schools and trusted industry partners across Nepal.\n\n${kb.baseUrl}/partners`,
    },
    {
      id: 'why_choose',
      respond: (kb) =>
        `**Why Choose Nepatronix?**\n\n${kb.whyChooseUs.map((w) => `• ${w}`).join('\n')}\n\nRecognized by: **${kb.recognizedBy.join(', ')}**`,
    },
    {
      id: 'hours',
      respond: (kb) => `We're open **${kb.contact.hours}**.\n\n📍 ${kb.contact.address}\n📞 ${kb.contact.phone}`,
    },
    {
      id: 'tech_iot',
      respond: (kb) =>
        `**Internet of Things (IoT)** connects physical devices with sensors and software over the internet. At Nepatronix, we teach and build IoT for smart automation, monitoring, and educational projects tailored to Nepal.\n\nExplore courses: ${kb.baseUrl}/services/courses`,
    },
    {
      id: 'tech_robotics',
      respond: (kb) =>
        `**Robotics** combines mechanical design, electronics, and programming. Our Kupondole (Lalitpur) lab prototypes educational robots and industrial automation systems.\n\nPrograms: ${kb.baseUrl}/services/stem-education`,
    },
    {
      id: 'tech_stem',
      respond: (kb) =>
        `**STEM** = Science, Technology, Engineering, Mathematics. We make it hands-on — students build circuits, code microcontrollers, and solve real problems.\n\n${kb.baseUrl}/services/stem-education`,
    },
    {
      id: 'tech_pcb',
      respond: (kb) =>
        `**PCB (Printed Circuit Board)** design connects electronic components. Nepatronix offers in-house PCB design and prototyping — rare capability in Nepal.\n\nR&D services: ${kb.baseUrl}/services/product-engineering`,
    },
    {
      id: 'tech_ai',
      respond: (kb) =>
        `We focus on **applied AI** — computer vision, smart algorithms for education tracking, and AI workstations in high-end lab setups.\n\nLearn more: ${kb.baseUrl}/services/stem-education`,
    },
    {
      id: 'thanks',
      respond: (kb) =>
        `You're welcome! If you need anything else — courses, lab quotes, or certificates — just ask.\n\n📞 ${kb.contact.phone} | ${kb.baseUrl}/contact`,
    },
  ]
}

const INTENT_KEYWORDS: Record<string, { terms: string[]; patterns?: RegExp[] }> = {
  greeting: { terms: [], patterns: [GREETING] },
  identity: {
    terms: ['who are you', 'your name', 'what are you', 'mahabir', 'chatbot', 'ai assistant'],
    patterns: [/who\s+are\s+you/i, /what\s+(is|are)\s+you/i],
  },
  contact: {
    terms: ['contact', 'email', 'phone', 'call', 'reach', 'whatsapp', 'message us'],
    patterns: [/how\s+(can|do)\s+i\s+(contact|reach)/i],
  },
  location: {
    terms: ['where', 'location', 'address', 'office', 'visit', 'tinkune', 'kathmandu', 'map'],
    patterns: [/where\s+(are|is)\s+you/i, /how\s+to\s+(find|reach)/i],
  },
  certificate_apply: {
    terms: ['apply certificate', 'apply for certificate', 'get certificate', 'certificate application', 'need certificate'],
    patterns: [/apply.*cert/i, /cert.*apply/i],
  },
  certificate_verify: {
    terms: ['verify certificate', 'certificate verify', 'check certificate', 'certificate uid', 'certificate id', 'authentic'],
    patterns: [/verify.*cert/i, /cert.*valid/i],
  },
  enrollment: {
    terms: ['enroll', 'enrollment', 'register', 'registration', 'sign up', 'join course', 'admission', 'how to join'],
    patterns: [/how\s+(to|can)\s+(enroll|register|join)/i],
  },
  courses: {
    terms: ['course', 'courses', 'training', 'program', 'programs', 'workshop', 'batch', 'class', 'learn', 'study'],
    patterns: [/what\s+courses/i, /list.*course/i, /course\s+list/i],
  },
  pricing: {
    terms: ['price', 'pricing', 'cost', 'fee', 'fees', 'how much', 'charge', 'affordable', 'npr', 'rupees'],
    patterns: [/how\s+much/i, /what.*cost/i],
  },
  lab_setup: {
    terms: ['lab setup', 'lab', 'laboratory', 'infrastructure', '3d print', 'workbench', 'stem lab', 'setup school'],
    patterns: [/lab\s+setup/i, /set\s*up.*lab/i],
  },
  stem_education: {
    terms: ['stem education', 'stem program', 'teacher training', 'ku recognized', 'kathmandu university', 'certified stem'],
    patterns: [/stem\s+(education|program|training)/i],
  },
  product_engineering: {
    terms: ['product engineering', 'r&d', 'prototype', 'prototyping', 'pcb', 'hardware', 'nep stem', 'manufacturing', 'firmware'],
    patterns: [/product\s+eng/i, /research.*develop/i],
  },
  institutional: {
    terms: ['government', 'ngo', 'csr', 'ingo', 'institutional', 'nationwide', 'large scale'],
  },
  services: {
    terms: ['service', 'services', 'what do you do', 'what do you offer', 'help me with', 'offerings'],
    patterns: [/what\s+(do|can)\s+you\s+(do|offer)/i],
  },
  about: {
    terms: ['about', 'company', 'nepatronix', 'nepa tronix', 'who is nepatronix', 'tell me about'],
    patterns: [/about\s+(us|nepatronix)/i, /what\s+is\s+nepatronix/i],
  },
  founder: {
    terms: ['founder', 'ceo', 'razu', 'shrestha', 'leadership'],
    patterns: [/who\s+(is|founded)/i],
  },
  team: {
    terms: ['team', 'staff', 'mentor', 'mentors', 'instructor', 'engineer', 'who works'],
    patterns: [/your\s+team/i, /meet\s+the\s+team/i],
  },
  blog: {
    terms: ['blog', 'article', 'articles', 'news', 'post', 'posts', 'read'],
    patterns: [/latest\s+(news|blog|article)/i],
  },
  gallery: {
    terms: ['gallery', 'photo', 'photos', 'picture', 'pictures', 'image', 'images', 'event photos'],
  },
  partners: {
    terms: ['partner', 'partners', 'collaboration', 'school partner', 'trusted'],
  },
  why_choose: {
    terms: ['why choose', 'why nepatronix', 'different', 'best', 'advantage', 'unique'],
  },
  hours: {
    terms: ['hours', 'open', 'timing', 'time', 'when open', 'working hours', 'schedule'],
    patterns: [/what\s+time/i, /when\s+(are|is)\s+(you|office)\s+open/i],
  },
  tech_iot: {
    terms: ['what is iot', 'internet of things', 'iot'],
    patterns: [/what\s+is\s+iot/i],
  },
  tech_robotics: {
    terms: ['what is robot', 'robotics', 'robot'],
    patterns: [/what\s+is\s+robot/i],
  },
  tech_stem: {
    terms: ['what is stem', 'stem meaning', 'stem stand'],
    patterns: [/what\s+(is|does)\s+stem/i],
  },
  tech_pcb: {
    terms: ['what is pcb', 'printed circuit'],
    patterns: [/what\s+is\s+pcb/i],
  },
  tech_ai: {
    terms: ['what is ai', 'artificial intelligence', 'machine learning'],
    patterns: [/what\s+is\s+(ai|artificial)/i],
  },
  thanks: {
    terms: ['thank', 'thanks', 'thankyou', 'appreciate', 'helpful', 'great help'],
    patterns: [/thank\s*(you|s|u)/i],
  },
}

function scoreIntent(id: string, query: string): number {
  const cfg = INTENT_KEYWORDS[id]
  if (!cfg) return 0

  let score = 0
  for (const term of cfg.terms) {
    if (query.includes(term)) score += term.length > 6 ? 4 : term.includes(' ') ? 3 : 2
  }
  for (const pattern of cfg.patterns || []) {
    if (pattern.test(query)) score += 6
  }
  return score
}

function detectLastIntent(history: ChatMessage[]): string | undefined {
  for (let i = history.length - 1; i >= 0; i--) {
    const msg = history[i]
    if (msg.role !== 'bot') continue
    const t = msg.text.toLowerCase()
    if (t.includes('training programs') || t.includes('our courses')) return 'courses'
    if (t.includes('lab setup') || t.includes('lab tiers')) return 'lab_setup'
    if (t.includes('contact nepatronix')) return 'contact'
    if (t.includes('apply for a certificate')) return 'certificate_apply'
    if (t.includes('our services')) return 'services'
    if (t.includes('certified stem')) return 'stem_education'
    break
  }
  return undefined
}

function fallbackResponse(kb: ChatKnowledge, query: string): string {
  const pages = searchPages(kb, query)
  if (pages.length) {
    const links = pages.map((p) => `• **${p.label}** — ${p.description}\n  ${kb.baseUrl}${p.path}`).join('\n\n')
    return `I couldn't find an exact answer, but these pages may help:\n\n${links}\n\nOr contact us:\n📞 ${kb.contact.phone}\n📧 ${kb.contact.email}`
  }

  return `I'm not fully sure about that specific question, but I'm trained on all Nepatronix services and live course data.\n\nTry asking about:\n• Courses & enrollment\n• STEM lab setup\n• Certificates\n• Contact & location\n\n📞 ${kb.contact.phone}\n📧 ${kb.contact.email}\n💬 WhatsApp: ${kb.founder.whatsapp}\n\nContact form: ${kb.baseUrl}/contact`
}

const intents = buildIntents()
const intentMap = new Map(intents.map((i) => [i.id, i]))

export function generateChatReply(
  kb: ChatKnowledge,
  message: string,
  history: ChatMessage[] = []
): ChatReply {
  const query = message.toLowerCase().trim()
  if (!query) {
    return {
      text: 'Please type a question and I will help you with Nepatronix courses, services, or contact details.',
      intent: 'empty',
      confidence: 1,
    }
  }

  const lastIntent = detectLastIntent(history)
  const isFollowUp = FOLLOW_UP.test(query) && query.split(/\s+/).length <= 6

  if (isFollowUp && lastIntent && intentMap.has(lastIntent)) {
    const intent = intentMap.get(lastIntent)!
    return {
      text: intent.respond(kb, query, lastIntent),
      intent: lastIntent,
      confidence: 0.85,
    }
  }

  const scored = intents
    .map((intent) => ({
      id: intent.id,
      score: scoreIntent(intent.id, query),
      respond: intent.respond,
    }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)

  if (scored.length > 0) {
    const best = scored[0]
    const intent = intentMap.get(best.id)!
    const confidence = Math.min(1, best.score / 10)
    return {
      text: intent.respond(kb, query, best.id),
      intent: best.id,
      confidence,
    }
  }

  if (GREETING.test(query) && query.split(/\s+/).length <= 4) {
    return {
      text: intentMap.get('greeting')!.respond(kb, query),
      intent: 'greeting',
      confidence: 0.9,
    }
  }

  return {
    text: fallbackResponse(kb, query),
    intent: 'fallback',
    confidence: 0.3,
  }
}
