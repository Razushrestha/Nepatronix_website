import { connectToDatabase } from '@/lib/mongodb'
import { Post } from '@/lib/models'
import { canonicalBlogSlug } from '@/lib/blog/slugPath'
import { resolveImageUrl, type ContentImage } from '@/lib/content-image'

export interface BlogPostDoc {
  _id: unknown
  title?: string
  slug?: string
  excerpt?: string
  author?: string
  seoTitle?: string
  seoDescription?: string
  focusKeyword?: string
  keywords?: string[]
  tags?: string[]
  mainImage?: ContentImage
  categories?: string[]
  publishedAt?: Date | string
  readingTime?: string
  body?: unknown[]
  updatedAt?: Date | string
}

export interface BlogListPost {
  _id: string
  title: string
  excerpt: string
  publishedAt: string
  readingTime: string
  categories: string[]
  tags: string[]
  mainImage?: ContentImage
  author: string
  slug: { current: string }
}

function toIsoDate(value: Date | string | undefined): string {
  if (!value) return ''
  if (value instanceof Date) return value.toISOString()
  return String(value)
}

export async function getAllBlogPosts(): Promise<BlogPostDoc[]> {
  await connectToDatabase()
  return Post.find({ slug: { $exists: true, $ne: '' } })
    .sort({ publishedAt: -1, updatedAt: -1 })
    .lean<BlogPostDoc[]>()
}

export async function resolvePostIdFromCanonicalSlug(
  canonicalSlug: string
): Promise<string | null> {
  const posts = await getAllBlogPosts()
  for (const post of posts) {
    const canon = canonicalBlogSlug(post.slug || '')
    if (canon === canonicalSlug) return String(post._id)
  }
  return null
}

export async function getBlogPostById(id: string): Promise<BlogPostDoc | null> {
  await connectToDatabase()
  return Post.findById(id).lean<BlogPostDoc>()
}

export async function getBlogPostByCanonicalSlug(
  canonicalSlug: string
): Promise<BlogPostDoc | null> {
  const id = await resolvePostIdFromCanonicalSlug(canonicalSlug)
  if (!id) return null
  return getBlogPostById(id)
}

export function toBlogListPost(post: BlogPostDoc): BlogListPost | null {
  const slug = canonicalBlogSlug(post.slug || '')
  if (!slug) return null
  return {
    _id: String(post._id),
    title: post.title || '',
    excerpt: post.excerpt || '',
    publishedAt: toIsoDate(post.publishedAt),
    readingTime: post.readingTime || '',
    categories: post.categories || [],
    tags: post.tags || [],
    mainImage: post.mainImage,
    author: post.author || '',
    slug: { current: slug },
  }
}

export async function getRelatedBlogPosts(
  excludeId: string,
  categories: string[],
  limit = 3
): Promise<BlogListPost[]> {
  if (!categories.length) return []
  await connectToDatabase()
  const docs = await Post.find({
    _id: { $ne: excludeId },
    categories: { $in: categories },
    slug: { $exists: true, $ne: '' },
  })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean<BlogPostDoc[]>()

  return docs.flatMap((doc) => {
    const item = toBlogListPost(doc)
    return item ? [item] : []
  })
}

export function blogPostImageUrl(post: { mainImage?: ContentImage }, fallback = ''): string {
  return resolveImageUrl(post.mainImage, fallback)
}
