import mongoose, { Schema, model, models, Model } from 'mongoose'

/**
 * Central Mongoose model registry for the whole app.
 *
 * Images are stored as { url, alt, caption } where `url` typically points at
 * a GridFS-served file (`/api/files/<id>`) but may also be an external URL.
 * Files (pdf/video) are stored the same way as { url, name }.
 */

const ImageSchema = new Schema(
  {
    url: { type: String, default: '' },
    alt: { type: String, default: '' },
    caption: { type: String, default: '' },
  },
  { _id: false }
)

const FileSchema = new Schema(
  {
    url: { type: String, default: '' },
    name: { type: String, default: '' },
  },
  { _id: false }
)

function makeModel<T>(name: string, schema: Schema): Model<T> {
  return (models[name] as Model<T>) || model<T>(name, schema)
}

/* ───────────────────────── Admin users ───────────────────────── */
const AdminUserSchema = new Schema(
  {
    name: { type: String, default: '' },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'editor', 'viewer'], default: 'admin' },
    avatar: { type: ImageSchema, default: undefined },
    lastLoginAt: { type: Date },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
)
export const AdminUser = makeModel('AdminUser', AdminUserSchema)

/* ───────────────────────── Enrollments ───────────────────────── */
const EnrollmentSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    organization: String,
    courseName: { type: String, required: true },
    coursePrice: String,
    message: String,
    status: {
      type: String,
      enum: ['pending', 'contacted', 'enrolled', 'cancelled'],
      default: 'pending',
    },
    notes: String,
  },
  { timestamps: true }
)
export const Enrollment = makeModel('Enrollment', EnrollmentSchema)

/* ─────────────────── Certification applications ───────────────── */
const CertificationSchema = new Schema(
  {
    applicantName: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    profileImage: { type: ImageSchema, default: undefined },
    courseType: { type: String, enum: ['paid', 'free'] },
    trainingHours: String,
    trainingDays: String,
    courseName: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'payment_verified', 'approved', 'certificate_generated', 'rejected'],
      default: 'pending',
    },
    paymentDetails: {
      amount: Number,
      paymentMethod: String,
      paymentDate: Date,
      paymentProof: { type: ImageSchema, default: undefined },
    },
    certificateDetails: {
      certificateUID: String,
      issueDate: Date,
      certificateUrl: String,
      qrCodeData: String,
    },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)
export const Certification = makeModel('Certification', CertificationSchema)

/* ───────────────────────── Courses ───────────────────────────── */
const CourseSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, index: true },
    price: Number,
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
    duration: String,
    hours: Number,
    deliveryMode: { type: String, enum: ['Online', 'In-Person', 'Blended'] },
    examMode: { type: String, enum: ['Online', 'In-Person', 'Blended'] },
    priceUnit: { type: String, default: 'per person' },
    popular: { type: Boolean, default: false },
    isFree: { type: Boolean, default: false },
    highlights: [String],
    coursePdf: {
      pdfFile: { type: FileSchema, default: undefined },
      pdfTitle: String,
    },
    // Upcoming session fields
    isUpcoming: { type: Boolean, default: false },
    sessionStatus: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' },
    sessionStartDate: Date,
    sessionEndDate: Date,
    enrollmentDeadline: Date,
    maxSeats: Number,
    currentEnrollments: { type: Number, default: 0 },
    sessionVenue: String,
    batchName: String,
    meetingUrl: String,
    registrationLink: String,
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)
export const Course = makeModel('Course', CourseSchema)

/* ───────────────────────── Blog posts ────────────────────────── */
const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, index: true },
    excerpt: String,
    author: String,
    seoTitle: String,
    seoDescription: String,
    focusKeyword: String,
    keywords: [String],
    tags: [String],
    canonicalUrl: String,
    ogImage: { type: ImageSchema, default: undefined },
    noIndex: { type: Boolean, default: false },
    mainImage: { type: ImageSchema, default: undefined },
    categories: [String],
    publishedAt: Date,
    readingTime: String,
    // Portable-text style block array preserved as-is.
    body: { type: Schema.Types.Mixed, default: [] },
    // Facebook auto-share
    facebookPostId: { type: String, default: '' },
  },
  { timestamps: true }
)
export const Post = makeModel('Post', PostSchema)

/* ───────────────────────── Gallery ───────────────────────────── */
const GallerySchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    images: { type: [ImageSchema], default: [] },
    publishedAt: Date,
    fbPhotoId: String,
  },
  { timestamps: true }
)
export const Gallery = makeModel('Gallery', GallerySchema)

/* ───────────────────────── Team members ──────────────────────── */
const TeamMemberSchema = new Schema(
  {
    name: { type: String, required: true },
    title: String,
    role: { type: String, enum: ['Leadership', 'Advisor', 'Team'] },
    image: { type: ImageSchema, default: undefined },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)
export const TeamMember = makeModel('TeamMember', TeamMemberSchema)

/* ───────────────────────── Partners ──────────────────────────── */
const PartnerSchema = new Schema(
  {
    name: { type: String, required: true },
    logo: { type: ImageSchema, default: undefined },
    type: { type: String, enum: ['trusted', 'school', 'recognition'] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)
export const Partner = makeModel('Partner', PartnerSchema)

/* ───────────────────────── Schools ───────────────────────────── */
const SchoolSchema = new Schema(
  {
    name: { type: String, required: true },
    logo: { type: ImageSchema, default: undefined },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)
export const School = makeModel('School', SchoolSchema)

/* ───────────────────────── Testimonials ──────────────────────── */
const TestimonialSchema = new Schema(
  {
    name: { type: String, required: true },
    role: String,
    rating: { type: Number, default: 5 },
    review: String,
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)
export const Testimonial = makeModel('Testimonial', TestimonialSchema)

/* ───────────────────────── Recognitions ──────────────────────── */
const RecognitionSchema = new Schema(
  {
    name: { type: String, required: true },
    logo: { type: ImageSchema, default: undefined },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)
export const Recognition = makeModel('Recognition', RecognitionSchema)

/* ───────────────────────── Hero slides ───────────────────────── */
const HeroSlideSchema = new Schema(
  {
    title: String,
    eyebrow: String,
    description: String,
    image: { type: ImageSchema, default: undefined },
    primaryCtaLabel: String,
    primaryCtaHref: String,
    secondaryCtaLabel: String,
    secondaryCtaHref: String,
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)
export const HeroSlide = makeModel('HeroSlide', HeroSlideSchema)

/* ───────────────────────── Features ──────────────────────────── */
const FeatureSchema = new Schema(
  {
    title: String,
    description: String,
    icon: String,
    iconImage: { type: ImageSchema, default: undefined },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)
export const Feature = makeModel('Feature', FeatureSchema)

/* ───────────────────────── Stats ─────────────────────────────── */
const StatSchema = new Schema(
  {
    value: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true, unique: true },
    detail: { type: String, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)
StatSchema.index({ order: 1 })
export const Stat = makeModel('Stat', StatSchema)

/* ───────────────────────── Course PDFs ───────────────────────── */
const CoursePdfSchema = new Schema(
  {
    courseId: { type: Number, required: true },
    title: { type: String, required: true },
    description: String,
    pdfFile: { type: FileSchema, default: undefined },
    thumbnail: { type: ImageSchema, default: undefined },
    pageCount: Number,
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
)
export const CoursePdf = makeModel('CoursePdf', CoursePdfSchema)

/* ───────────────────────── Course videos ─────────────────────── */
const CourseVideoSchema = new Schema(
  {
    courseId: { type: Number, required: true },
    title: { type: String, required: true },
    description: String,
    videoFile: { type: FileSchema, default: undefined },
    videoUrl: String,
    thumbnail: { type: ImageSchema, default: undefined },
    duration: String,
    overviewPdf: { type: FileSchema, default: undefined },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
)
export const CourseVideo = makeModel('CourseVideo', CourseVideoSchema)

/* ───────────────────────── Contact submissions ───────────────── */
const ContactFormSchema = new Schema(
  {
    name: String,
    email: String,
    phone: String,
    message: String,
    status: { type: String, enum: ['new', 'read', 'contacted'], default: 'new' },
  },
  { timestamps: true }
)
export const ContactForm = makeModel('ContactForm', ContactFormSchema)

/* ───────────────────────── Subscribers ───────────────────────── */
const SubscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    status: { type: String, enum: ['active', 'unsubscribed'], default: 'active' },
    subscribedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)
export const Subscriber = makeModel('Subscriber', SubscriberSchema)

/* ───────────────────────── Footer (singleton) ────────────────── */
const FooterSchema = new Schema(
  {
    key: { type: String, default: 'footer', unique: true },
    companyName: { type: String, default: 'Nepatronix' },
    tagline: String,
    description: String,
    contactInfo: {
      address: String,
      postalCode: String,
      weekdayHours: String,
      weekendHours: String,
    },
    quickLinks: [{ name: String, href: String }],
    expertise: [{ name: String, desc: String }],
    socialLinks: [{ platform: String, url: String }],
    copyrightText: String,
  },
  { timestamps: true }
)
export const Footer = makeModel('Footer', FooterSchema)

/* ───────────────────────── Contact page (singleton) ──────────── */
const ContactPageSchema = new Schema(
  {
    key: { type: String, default: 'contact', unique: true },
    pageTitle: { type: String, default: 'Contact us' },
    pageDescription: String,
    contactDetails: {
      email: String,
      phone: String,
      address: String,
      hours: String,
    },
    formTitle: String,
    formSubtitle: String,
    socialMedia: [{ platform: String, url: String }],
  },
  { timestamps: true }
)
export const ContactPage = makeModel('ContactPage', ContactPageSchema)

/* ───────────────────────── Visits (analytics) ────────────────── */
const VisitSchema = new Schema(
  {
    path: { type: String, default: '/' },
    visitorId: { type: String, index: true },
    sessionId: { type: String },
    referrer: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    device: { type: String, default: 'desktop' },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
)
export const Visit = makeModel('Visit', VisitSchema)

export const modelsMap = {
  AdminUser,
  Enrollment,
  Certification,
  Course,
  Post,
  Gallery,
  TeamMember,
  Partner,
  School,
  Testimonial,
  Recognition,
  HeroSlide,
  Feature,
  Stat,
  CoursePdf,
  CourseVideo,
  ContactForm,
  Subscriber,
  Footer,
  ContactPage,
}

export default mongoose
