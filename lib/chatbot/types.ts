export interface ChatCourse {
  title: string
  slug?: string
  level?: string
  duration?: string
  hours?: number
  price?: number
  priceUnit?: string
  isFree?: boolean
  deliveryMode?: string
  highlights?: string[]
  isUpcoming?: boolean
  sessionVenue?: string
}

export interface ChatTeamMember {
  name: string
  title?: string
  role?: string
}

export interface ChatBlogPost {
  title: string
  slug?: string
  excerpt?: string
}

export interface ChatContact {
  email: string
  phone: string
  address: string
  hours: string
}

export interface ChatKnowledge {
  baseUrl: string
  company: {
    name: string
    founded: string
    location: string
    about: string
    mission: string
    vision: string
  }
  founder: {
    name: string
    role: string
    whatsapp: string
  }
  contact: ChatContact
  stats: { label: string; value: string; detail?: string }[]
  services: {
    id: string
    title: string
    tagline?: string
    description: string
    url: string
  }[]
  labTiers: { name: string; focus: string; features: string[] }[]
  certifications: { name: string; hrs: string; delivery: string }[]
  courses: ChatCourse[]
  upcomingCourses: ChatCourse[]
  team: ChatTeamMember[]
  blogPosts: ChatBlogPost[]
  pages: { label: string; path: string; description: string }[]
  whyChooseUs: string[]
  recognizedBy: string[]
}

export interface ChatMessage {
  role: 'bot' | 'user'
  text: string
}

export interface ChatReply {
  text: string
  intent: string
  confidence: number
}
