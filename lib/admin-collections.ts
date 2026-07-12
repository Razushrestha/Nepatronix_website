/**
 * Client-safe registry describing every admin-managed collection.
 * Powers the dynamic sidebar, list views, and CRUD forms.
 * NO server-only imports here (no mongoose) so it can be used in client components.
 */

export type FieldType =
  | 'text'
  | 'textarea'
  | 'richtext'
  | 'number'
  | 'boolean'
  | 'select'
  | 'date'
  | 'datetime'
  | 'image'
  | 'images'
  | 'file'
  | 'tags'
  | 'group'
  | 'readonly'
  | 'seo'

export interface FieldDef {
  name: string
  label: string
  type: FieldType
  options?: { value: string; label: string }[]
  placeholder?: string
  help?: string
  /** Sub-fields for `group` (repeatable object) or nested object fields. */
  fields?: FieldDef[]
  /** For nested object path (e.g. contactInfo.address) rendered as a section. */
  object?: boolean
  fileAccept?: string
  required?: boolean
  fullWidth?: boolean
}

export interface ColumnDef {
  key: string
  label: string
  /** render hint */
  type?: 'text' | 'badge' | 'date' | 'image' | 'boolean' | 'email'
}

export interface CollectionConfig {
  slug: string
  label: string
  singular: string
  group: string
  icon: string
  singleton?: boolean
  /** hide "create" for read-only inbound data */
  noCreate?: boolean
  searchFields?: string[]
  statusField?: string
  statusOptions?: { value: string; label: string; color: string }[]
  defaultSort?: string
  columns: ColumnDef[]
  fields: FieldDef[]
}

const SECTION_HEADING_FIELDS: FieldDef[] = [
  { name: 'eyebrow', label: 'Eyebrow', type: 'text', placeholder: 'e.g. About Us' },
  { name: 'title', label: 'Title', type: 'text', placeholder: 'Section heading' },
  { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
]

const STATUS = {
  enrollment: [
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'contacted', label: 'Contacted', color: 'blue' },
    { value: 'enrolled', label: 'Enrolled', color: 'green' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' },
  ],
  cert: [
    { value: 'pending', label: 'Pending Payment', color: 'yellow' },
    { value: 'payment_verified', label: 'Payment Verified', color: 'blue' },
    { value: 'approved', label: 'Approved', color: 'green' },
    { value: 'certificate_generated', label: 'Certificate Ready', color: 'purple' },
    { value: 'rejected', label: 'Rejected', color: 'red' },
  ],
  contact: [
    { value: 'new', label: 'New', color: 'yellow' },
    { value: 'read', label: 'Read', color: 'blue' },
    { value: 'contacted', label: 'Contacted', color: 'green' },
  ],
}

export const collections: CollectionConfig[] = [
  /* ───────── Operations ───────── */
  {
    slug: 'enrollments',
    label: 'Enrollments',
    singular: 'Enrollment',
    group: 'Operations',
    icon: 'users',
    searchFields: ['fullName', 'email', 'phone', 'courseName', 'organization'],
    statusField: 'status',
    statusOptions: STATUS.enrollment,
    defaultSort: '-createdAt',
    columns: [
      { key: 'fullName', label: 'Name' },
      { key: 'courseName', label: 'Course' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'status', label: 'Status', type: 'badge' },
      { key: 'createdAt', label: 'Submitted', type: 'date' },
    ],
    fields: [
      { name: 'fullName', label: 'Full Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'text', required: true },
      { name: 'phone', label: 'Phone', type: 'text', required: true },
      { name: 'organization', label: 'School / Organization', type: 'text' },
      { name: 'courseName', label: 'Course Name', type: 'text', required: true },
      { name: 'coursePrice', label: 'Course Price', type: 'text' },
      { name: 'message', label: 'Message', type: 'textarea', fullWidth: true },
      { name: 'status', label: 'Status', type: 'select', options: STATUS.enrollment.map((s) => ({ value: s.value, label: s.label })) },
      { name: 'notes', label: 'Internal Notes', type: 'textarea', fullWidth: true },
    ],
  },
  {
    slug: 'certifications',
    label: 'Certifications',
    singular: 'Certification Application',
    group: 'Operations',
    icon: 'certificate',
    searchFields: ['applicantName', 'email', 'phone', 'courseName'],
    statusField: 'status',
    statusOptions: STATUS.cert,
    defaultSort: '-submittedAt',
    columns: [
      { key: 'profileImage', label: '', type: 'image' },
      { key: 'applicantName', label: 'Applicant' },
      { key: 'courseName', label: 'Course' },
      { key: 'status', label: 'Status', type: 'badge' },
      { key: 'submittedAt', label: 'Submitted', type: 'date' },
    ],
    fields: [
      { name: 'applicantName', label: 'Full Name', type: 'text', required: true },
      { name: 'gender', label: 'Gender', type: 'select', options: [
        { value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' } ] },
      { name: 'email', label: 'Email', type: 'text', required: true },
      { name: 'phone', label: 'Phone', type: 'text', required: true },
      { name: 'profileImage', label: 'Profile Photo', type: 'image' },
      { name: 'courseType', label: 'Course Type', type: 'select', options: [
        { value: 'paid', label: 'Paid' }, { value: 'free', label: 'Free' } ] },
      { name: 'trainingHours', label: 'Training Hours', type: 'text' },
      { name: 'trainingDays', label: 'Training Days', type: 'text' },
      { name: 'courseName', label: 'Course Name', type: 'text', required: true },
      { name: 'status', label: 'Status', type: 'select', options: STATUS.cert.map((s) => ({ value: s.value, label: s.label })) },
      { name: 'paymentDetails', label: 'Payment Information', type: 'group', object: true, fields: [
        { name: 'amount', label: 'Amount (NPR)', type: 'number' },
        { name: 'paymentMethod', label: 'Payment Method', type: 'select', options: [
          { value: 'eSewa', label: 'eSewa' }, { value: 'Khalti', label: 'Khalti' },
          { value: 'Bank Transfer', label: 'Bank Transfer' }, { value: 'Cash', label: 'Cash' } ] },
        { name: 'paymentDate', label: 'Payment Date', type: 'datetime' },
        { name: 'paymentProof', label: 'Payment Screenshot', type: 'image' },
      ] },
    ],
  },
  {
    slug: 'contactforms',
    label: 'Contact Messages',
    singular: 'Message',
    group: 'Operations',
    icon: 'mail',
    noCreate: true,
    searchFields: ['name', 'email', 'phone', 'message'],
    statusField: 'status',
    statusOptions: STATUS.contact,
    defaultSort: '-createdAt',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'status', label: 'Status', type: 'badge' },
      { key: 'createdAt', label: 'Received', type: 'date' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'email', label: 'Email', type: 'text' },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'message', label: 'Message', type: 'textarea', fullWidth: true },
      { name: 'status', label: 'Status', type: 'select', options: STATUS.contact.map((s) => ({ value: s.value, label: s.label })) },
    ],
  },
  {
    slug: 'subscribers',
    label: 'Subscribers',
    singular: 'Subscriber',
    group: 'Operations',
    icon: 'bell',
    searchFields: ['email'],
    statusField: 'status',
    statusOptions: [
      { value: 'active', label: 'Active', color: 'green' },
      { value: 'unsubscribed', label: 'Unsubscribed', color: 'red' },
    ],
    defaultSort: '-subscribedAt',
    columns: [
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'status', label: 'Status', type: 'badge' },
      { key: 'subscribedAt', label: 'Subscribed', type: 'date' },
    ],
    fields: [
      { name: 'email', label: 'Email', type: 'text', required: true },
      { name: 'status', label: 'Status', type: 'select', options: [
        { value: 'active', label: 'Active' }, { value: 'unsubscribed', label: 'Unsubscribed' } ] },
    ],
  },

  /* ───────── Content ───────── */
  {
    slug: 'courses',
    label: 'Courses',
    singular: 'Course',
    group: 'Content',
    icon: 'book',
    searchFields: ['title', 'slug'],
    defaultSort: 'order',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'level', label: 'Level' },
      { key: 'price', label: 'Price' },
      { key: 'isUpcoming', label: 'Upcoming', type: 'boolean' },
      { key: 'popular', label: 'Popular', type: 'boolean' },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', help: 'URL segment, e.g. stem-robotics' },
      { name: 'price', label: 'Price', type: 'number' },
      { name: 'priceUnit', label: 'Price Unit', type: 'text' },
      { name: 'level', label: 'Level', type: 'select', options: [
        { value: 'Beginner', label: 'Beginner' }, { value: 'Intermediate', label: 'Intermediate' }, { value: 'Advanced', label: 'Advanced' } ] },
      { name: 'duration', label: 'Duration', type: 'text' },
      { name: 'hours', label: 'Total Hours', type: 'number' },
      { name: 'deliveryMode', label: 'Delivery Mode', type: 'select', options: [
        { value: 'Online', label: 'Online' }, { value: 'In-Person', label: 'In-Person' }, { value: 'Blended', label: 'Blended' } ] },
      { name: 'examMode', label: 'Exam Mode', type: 'select', options: [
        { value: 'Online', label: 'Online' }, { value: 'In-Person', label: 'In-Person' }, { value: 'Blended', label: 'Blended' } ] },
      { name: 'popular', label: 'Mark as Popular', type: 'boolean' },
      { name: 'isFree', label: 'Free Course', type: 'boolean' },
      { name: 'highlights', label: 'Highlights', type: 'tags', fullWidth: true },
      { name: 'coursePdf', label: 'Course Overview PDF', type: 'group', object: true, fields: [
        { name: 'pdfTitle', label: 'PDF Title', type: 'text' },
        { name: 'pdfFile', label: 'PDF File', type: 'file', fileAccept: 'application/pdf' },
      ] },
      { name: 'order', label: 'Display Order', type: 'number' },
      { name: 'isUpcoming', label: 'Upcoming Session', type: 'boolean' },
      { name: 'sessionStatus', label: 'Session Status', type: 'select', options: [
        { value: 'upcoming', label: 'Upcoming' }, { value: 'ongoing', label: 'Ongoing' }, { value: 'completed', label: 'Completed' } ] },
      { name: 'sessionStartDate', label: 'Session Start', type: 'datetime' },
      { name: 'sessionEndDate', label: 'Session End', type: 'datetime' },
      { name: 'enrollmentDeadline', label: 'Enrollment Deadline', type: 'datetime' },
      { name: 'maxSeats', label: 'Max Seats', type: 'number' },
      { name: 'currentEnrollments', label: 'Current Enrollments', type: 'number' },
      { name: 'sessionVenue', label: 'Venue', type: 'text' },
      { name: 'batchName', label: 'Batch Name', type: 'text' },
      { name: 'meetingUrl', label: 'Meeting URL', type: 'text' },
      { name: 'registrationLink', label: 'External Registration Link', type: 'text' },
    ],
  },
  {
    slug: 'posts',
    label: 'Blog Posts',
    singular: 'Post',
    group: 'Content',
    icon: 'pencil',
    searchFields: ['title', 'slug', 'author'],
    defaultSort: '-publishedAt',
    columns: [
      { key: 'mainImage', label: '', type: 'image' },
      { key: 'title', label: 'Title' },
      { key: 'author', label: 'Author' },
      { key: 'publishedAt', label: 'Published', type: 'date' },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', help: 'lowercase-with-hyphens' },
      { name: 'author', label: 'Author', type: 'text' },
      { name: 'readingTime', label: 'Reading Time', type: 'text' },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea', fullWidth: true },
      { name: 'mainImage', label: 'Main Image', type: 'image' },
      { name: 'categories', label: 'Categories', type: 'tags' },
      { name: 'tags', label: 'Tags', type: 'tags' },
      { name: 'publishedAt', label: 'Published At', type: 'datetime' },
      { name: 'body', label: 'Body', type: 'richtext', fullWidth: true },
      // Dynamic SEO section (manages seoTitle, seoDescription, focusKeyword, keywords)
      { name: 'seo', label: 'Search Engine Optimization', type: 'seo', fullWidth: true },
      { name: 'canonicalUrl', label: 'Canonical URL', type: 'text', help: 'Optional. Use only if this content exists at another primary URL.' },
      { name: 'ogImage', label: 'Social Share Image (OG)', type: 'image', help: 'Optional. Overrides the main image when shared on social media (1200×630 recommended).' },
      { name: 'noIndex', label: 'Hide from search engines (noindex)', type: 'boolean' },
      { name: 'shareToFacebook', label: 'Share to Facebook', type: 'boolean', help: 'On create this posts automatically when published. On edit, turn on + save to share now.' },
      { name: 'facebookPostId', label: 'Facebook Post ID', type: 'readonly', help: 'Set automatically once shared. Prevents duplicate posts.' },
    ],
  },
  {
    slug: 'galleries',
    label: 'Gallery',
    singular: 'Gallery Album',
    group: 'Content',
    icon: 'image',
    searchFields: ['title', 'description'],
    defaultSort: '-publishedAt',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'publishedAt', label: 'Published', type: 'date' },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
      { name: 'images', label: 'Images', type: 'images', fullWidth: true },
      { name: 'publishedAt', label: 'Published At', type: 'datetime' },
    ],
  },
  {
    slug: 'teammembers',
    label: 'Team',
    singular: 'Team Member',
    group: 'Content',
    icon: 'user',
    searchFields: ['name', 'title', 'role'],
    defaultSort: 'order',
    columns: [
      { key: 'image', label: '', type: 'image' },
      { key: 'name', label: 'Name' },
      { key: 'title', label: 'Title' },
      { key: 'role', label: 'Role' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'title', label: 'Job Title', type: 'text' },
      { name: 'role', label: 'Role Category', type: 'select', options: [
        { value: 'Leadership', label: 'Leadership' }, { value: 'Advisor', label: 'Advisor' }, { value: 'Team', label: 'Team' } ] },
      { name: 'image', label: 'Photo', type: 'image' },
      { name: 'order', label: 'Display Order', type: 'number' },
    ],
  },
  {
    slug: 'partners',
    label: 'Partners',
    singular: 'Partner',
    group: 'Content',
    icon: 'handshake',
    searchFields: ['name'],
    defaultSort: 'order',
    columns: [
      { key: 'logo', label: '', type: 'image' },
      { key: 'name', label: 'Name' },
      { key: 'type', label: 'Type' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'logo', label: 'Logo', type: 'image' },
      { name: 'type', label: 'Type', type: 'select', options: [
        { value: 'trusted', label: 'Trusted Partner' }, { value: 'school', label: 'School Collaboration' }, { value: 'recognition', label: 'Recognition' } ] },
      { name: 'order', label: 'Display Order', type: 'number' },
    ],
  },
  {
    slug: 'schools',
    label: 'Schools',
    singular: 'School',
    group: 'Content',
    icon: 'school',
    searchFields: ['name'],
    defaultSort: 'order',
    columns: [
      { key: 'logo', label: '', type: 'image' },
      { key: 'name', label: 'Name' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'logo', label: 'Logo', type: 'image' },
      { name: 'order', label: 'Display Order', type: 'number' },
    ],
  },
  {
    slug: 'testimonials',
    label: 'Testimonials',
    singular: 'Testimonial',
    group: 'Content',
    icon: 'quote',
    searchFields: ['name', 'role', 'review'],
    defaultSort: 'order',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'role', label: 'Role' },
      { key: 'rating', label: 'Rating' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'role', label: 'Role', type: 'text' },
      { name: 'rating', label: 'Rating (1-5)', type: 'number' },
      { name: 'review', label: 'Review', type: 'textarea', fullWidth: true },
      { name: 'order', label: 'Display Order', type: 'number' },
    ],
  },
  {
    slug: 'recognitions',
    label: 'Recognitions',
    singular: 'Recognition',
    group: 'Content',
    icon: 'award',
    searchFields: ['name'],
    defaultSort: 'order',
    columns: [
      { key: 'logo', label: '', type: 'image' },
      { key: 'name', label: 'Name' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'logo', label: 'Logo', type: 'image' },
      { name: 'order', label: 'Display Order', type: 'number' },
    ],
  },
  {
    slug: 'heroslides',
    label: 'Hero Slides',
    singular: 'Hero Slide',
    group: 'Content',
    icon: 'slideshow',
    searchFields: ['title', 'eyebrow'],
    defaultSort: 'order',
    columns: [
      { key: 'image', label: '', type: 'image' },
      { key: 'title', label: 'Title' },
      { key: 'eyebrow', label: 'Eyebrow' },
    ],
    fields: [
      { name: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
      { name: 'image', label: 'Image', type: 'image' },
      { name: 'primaryCtaLabel', label: 'Primary CTA Label', type: 'text' },
      { name: 'primaryCtaHref', label: 'Primary CTA Href', type: 'text' },
      { name: 'secondaryCtaLabel', label: 'Secondary CTA Label', type: 'text' },
      { name: 'secondaryCtaHref', label: 'Secondary CTA Href', type: 'text' },
      { name: 'order', label: 'Display Order', type: 'number' },
    ],
  },
  {
    slug: 'features',
    label: 'Features',
    singular: 'Feature',
    group: 'Content',
    icon: 'sparkles',
    searchFields: ['title'],
    defaultSort: 'order',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'description', label: 'Description' },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
      { name: 'icon', label: 'Icon (name or SVG)', type: 'text' },
      { name: 'iconImage', label: 'Icon Image', type: 'image' },
      { name: 'order', label: 'Display Order', type: 'number' },
    ],
  },
  {
    slug: 'stats',
    label: 'Homepage Stats',
    singular: 'Homepage Stat',
    group: 'Content',
    icon: 'numbers',
    searchFields: ['label', 'value', 'detail'],
    defaultSort: 'order',
    columns: [
      { key: 'value', label: 'Value' },
      { key: 'label', label: 'Label' },
      { key: 'detail', label: 'Detail' },
      { key: 'order', label: 'Order' },
    ],
    fields: [
      { name: 'value', label: 'Value', type: 'text', required: true, placeholder: 'e.g. 50+', help: 'Large number shown on the homepage stats bar' },
      { name: 'label', label: 'Label', type: 'text', required: true, placeholder: 'e.g. Partners with school', help: 'Short title under the value' },
      { name: 'detail', label: 'Detail', type: 'text', placeholder: 'e.g. Across Nepal', help: 'Supporting line below the label' },
      { name: 'order', label: 'Display Order', type: 'number', help: 'Left to right on the homepage (0 = first)' },
    ],
  },
  {
    slug: 'homeservices',
    label: 'Home Services',
    singular: 'Home Service',
    group: 'Content',
    icon: 'sparkles',
    searchFields: ['title', 'description'],
    defaultSort: 'order',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'href', label: 'Link' },
      { key: 'order', label: 'Order' },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
      { name: 'href', label: 'Link URL', type: 'text', placeholder: '/services/stem-education' },
      { name: 'iconKey', label: 'Icon', type: 'select', options: [
        { value: 'stem', label: 'STEM / Education' },
        { value: 'lab', label: 'Lab Setup' },
        { value: 'software', label: 'Software / Code' },
        { value: 'research', label: 'Research / Innovation' },
      ] },
      { name: 'colorClass', label: 'Icon Color Class', type: 'select', options: [
        { value: 'text-blue-600', label: 'Blue' },
        { value: 'text-red-600', label: 'Red' },
        { value: 'text-emerald-600', label: 'Green' },
        { value: 'text-purple-600', label: 'Purple' },
      ] },
      { name: 'order', label: 'Display Order', type: 'number' },
    ],
  },
  {
    slug: 'accreditations',
    label: 'Accreditations',
    singular: 'Accreditation',
    group: 'Content',
    icon: 'award',
    searchFields: ['title', 'badge'],
    defaultSort: 'order',
    columns: [
      { key: 'logo', label: '', type: 'image' },
      { key: 'title', label: 'Title' },
      { key: 'badge', label: 'Badge' },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'badge', label: 'Badge Label', type: 'text', placeholder: 'Academic accreditation' },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
      { name: 'logo', label: 'Logo', type: 'image' },
      { name: 'badgeTone', label: 'Badge Color', type: 'select', options: [
        { value: 'blue', label: 'Blue' }, { value: 'emerald', label: 'Green' } ] },
      { name: 'order', label: 'Display Order', type: 'number' },
    ],
  },
  {
    slug: 'incubators',
    label: 'Incubators',
    singular: 'Incubator',
    group: 'Content',
    icon: 'handshake',
    searchFields: ['name'],
    defaultSort: 'order',
    columns: [
      { key: 'logo', label: '', type: 'image' },
      { key: 'name', label: 'Name' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'logo', label: 'Logo', type: 'image' },
      { name: 'order', label: 'Display Order', type: 'number' },
    ],
  },
  {
    slug: 'portfolioitems',
    label: 'Portfolio',
    singular: 'Portfolio Item',
    group: 'Content',
    icon: 'globe',
    searchFields: ['name', 'url'],
    defaultSort: 'order',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'url', label: 'URL' },
    ],
    fields: [
      { name: 'name', label: 'Project Name', type: 'text', required: true },
      { name: 'url', label: 'Website URL', type: 'text', required: true, placeholder: 'https://example.com' },
      { name: 'order', label: 'Display Order', type: 'number' },
    ],
  },
  {
    slug: 'coursepdfs',
    label: 'Course PDFs',
    singular: 'Course PDF',
    group: 'Content',
    icon: 'file',
    searchFields: ['title'],
    defaultSort: 'order',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'courseId', label: 'Course ID' },
      { key: 'isPublished', label: 'Published', type: 'boolean' },
    ],
    fields: [
      { name: 'courseId', label: 'Course ID', type: 'number', required: true },
      { name: 'title', label: 'PDF Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
      { name: 'pdfFile', label: 'PDF File', type: 'file', fileAccept: 'application/pdf' },
      { name: 'thumbnail', label: 'Thumbnail', type: 'image' },
      { name: 'pageCount', label: 'Page Count', type: 'number' },
      { name: 'order', label: 'Display Order', type: 'number' },
      { name: 'isPublished', label: 'Published', type: 'boolean' },
    ],
  },
  {
    slug: 'coursevideos',
    label: 'Course Videos',
    singular: 'Course Video',
    group: 'Content',
    icon: 'video',
    searchFields: ['title'],
    defaultSort: 'order',
    columns: [
      { key: 'thumbnail', label: '', type: 'image' },
      { key: 'title', label: 'Title' },
      { key: 'courseId', label: 'Course ID' },
      { key: 'isPublished', label: 'Published', type: 'boolean' },
    ],
    fields: [
      { name: 'courseId', label: 'Course ID', type: 'number', required: true },
      { name: 'title', label: 'Video Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
      { name: 'videoFile', label: 'Video File', type: 'file', fileAccept: 'video/*' },
      { name: 'videoUrl', label: 'External Video URL', type: 'text' },
      { name: 'thumbnail', label: 'Thumbnail', type: 'image' },
      { name: 'duration', label: 'Duration', type: 'text' },
      { name: 'overviewPdf', label: 'Overview PDF', type: 'file', fileAccept: 'application/pdf' },
      { name: 'order', label: 'Display Order', type: 'number' },
      { name: 'isPublished', label: 'Published', type: 'boolean' },
    ],
  },

  /* ───────── Site Settings (singletons) ───────── */
  {
    slug: 'homepage',
    label: 'Homepage',
    singular: 'Homepage',
    group: 'Site Settings',
    icon: 'layout',
    singleton: true,
    columns: [],
    fields: [
      { name: 'about', label: 'About Section', type: 'group', object: true, fullWidth: true, fields: [
        { name: 'eyebrow', label: 'Eyebrow', type: 'text' },
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
        { name: 'paragraph1', label: 'Paragraph 1', type: 'textarea', fullWidth: true },
        { name: 'paragraph2', label: 'Paragraph 2', type: 'textarea', fullWidth: true },
        { name: 'tagline', label: 'Tagline', type: 'text' },
        { name: 'foundedYear', label: 'Founded Year', type: 'text' },
        { name: 'vision', label: 'Vision Quote', type: 'textarea', fullWidth: true },
        { name: 'mission', label: 'Mission Quote', type: 'textarea', fullWidth: true },
      ] },
      { name: 'recognition', label: 'Recognition Section', type: 'group', object: true, fields: SECTION_HEADING_FIELDS },
      { name: 'certification', label: 'Certification Section', type: 'group', object: true, fields: SECTION_HEADING_FIELDS },
      { name: 'incubation', label: 'Incubation Section', type: 'group', object: true, fields: SECTION_HEADING_FIELDS },
      { name: 'services', label: 'Services Section', type: 'group', object: true, fields: SECTION_HEADING_FIELDS },
      { name: 'partners', label: 'Partners Section', type: 'group', object: true, fields: SECTION_HEADING_FIELDS },
      { name: 'portfolio', label: 'Portfolio Section', type: 'group', object: true, fields: SECTION_HEADING_FIELDS },
      { name: 'schools', label: 'Schools Section', type: 'group', object: true, fields: SECTION_HEADING_FIELDS },
      { name: 'testimonials', label: 'Testimonials Section', type: 'group', object: true, fields: SECTION_HEADING_FIELDS },
    ],
  },
  {
    slug: 'footer',
    label: 'Footer',
    singular: 'Footer',
    group: 'Site Settings',
    icon: 'layout',
    singleton: true,
    columns: [],
    fields: [
      { name: 'companyName', label: 'Company Name', type: 'text' },
      { name: 'tagline', label: 'Tagline', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
      { name: 'contactInfo', label: 'Contact Information', type: 'group', object: true, fields: [
        { name: 'address', label: 'Address', type: 'text' },
        { name: 'postalCode', label: 'Postal Code', type: 'text' },
        { name: 'weekdayHours', label: 'Weekday Hours', type: 'text' },
        { name: 'weekendHours', label: 'Weekend Hours', type: 'text' },
      ] },
      { name: 'quickLinks', label: 'Quick Links', type: 'group', fullWidth: true, fields: [
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'href', label: 'URL', type: 'text' },
      ] },
      { name: 'expertise', label: 'Expertise / Services', type: 'group', fullWidth: true, fields: [
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'desc', label: 'Description', type: 'text' },
      ] },
      { name: 'socialLinks', label: 'Social Links', type: 'group', fullWidth: true, fields: [
        { name: 'platform', label: 'Platform', type: 'text' },
        { name: 'url', label: 'URL', type: 'text' },
      ] },
      { name: 'copyrightText', label: 'Copyright Text', type: 'text', fullWidth: true },
    ],
  },
  {
    slug: 'contactpage',
    label: 'Contact Page',
    singular: 'Contact Page',
    group: 'Site Settings',
    icon: 'phone',
    singleton: true,
    columns: [],
    fields: [
      { name: 'pageTitle', label: 'Page Title', type: 'text' },
      { name: 'pageDescription', label: 'Page Description', type: 'textarea', fullWidth: true },
      { name: 'contactDetails', label: 'Contact Details', type: 'group', object: true, fields: [
        { name: 'email', label: 'Email', type: 'text' },
        { name: 'phone', label: 'Phone', type: 'text' },
        { name: 'address', label: 'Address', type: 'text' },
        { name: 'hours', label: 'Working Hours', type: 'text' },
      ] },
      { name: 'formTitle', label: 'Form Title', type: 'text' },
      { name: 'formSubtitle', label: 'Form Subtitle', type: 'text' },
      { name: 'socialMedia', label: 'Social Media', type: 'group', fullWidth: true, fields: [
        { name: 'platform', label: 'Platform', type: 'text' },
        { name: 'url', label: 'URL', type: 'text' },
      ] },
    ],
  },

  /* ───────── System ───────── */
  {
    slug: 'adminusers',
    label: 'Admin Users',
    singular: 'Admin User',
    group: 'System',
    icon: 'shield',
    searchFields: ['name', 'email'],
    defaultSort: '-createdAt',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'role', label: 'Role' },
      { key: 'active', label: 'Active', type: 'boolean' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'email', label: 'Email', type: 'text', required: true },
      { name: 'password', label: 'Password', type: 'text', help: 'Leave blank to keep current password when editing' },
      { name: 'role', label: 'Role', type: 'select', options: [
        { value: 'admin', label: 'Admin' }, { value: 'editor', label: 'Editor' }, { value: 'viewer', label: 'Viewer' } ] },
      { name: 'active', label: 'Active', type: 'boolean' },
    ],
  },
]

export const collectionMap: Record<string, CollectionConfig> = Object.fromEntries(
  collections.map((c) => [c.slug, c])
)

/**
 * Collections the "editor" role may access (view + create/edit/delete).
 * Admins can access every collection; viewers get read-only on this same set.
 * Everything not listed here is admin-only.
 */
export const EDITOR_COLLECTIONS = new Set<string>([
  'galleries',
  'teammembers',
  'partners',
  'schools',
  'testimonials',
  'recognitions',
  'stats',
  'features',
  'heroslides',
  'homeservices',
  'accreditations',
  'incubators',
  'portfolioitems',
  'homepage',
  'coursepdfs',
  'contactpage',
  'enrollments',
  'certifications',
  'contactforms',
])

/** Can this role see/list this collection? */
export function canView(slug: string, role?: string): boolean {
  if (role === 'admin') return true
  if (role === 'editor' || role === 'viewer') return EDITOR_COLLECTIONS.has(slug)
  return false
}

/** Can this role create/update/delete in this collection? */
export function canEdit(slug: string, role?: string): boolean {
  if (role === 'admin') return true
  if (role === 'editor') return EDITOR_COLLECTIONS.has(slug)
  return false // viewers are read-only
}

export function getCollection(slug: string): CollectionConfig | undefined {
  return collectionMap[slug]
}

export const groupOrder = ['Operations', 'Content', 'Site Settings', 'System']
