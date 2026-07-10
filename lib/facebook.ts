/**
 * Publish to a Facebook Page via the Graph API.
 *
 * Requires a PAGE access token with the `pages_manage_posts` permission:
 *   FB_PAGE_ID              - the numeric Page ID
 *   FB_PAGE_ACCESS_TOKEN    - a long-lived Page access token
 *   FB_API_VERSION          - optional, defaults to v21.0
 *
 * Returns the created post id, or null if not configured / failed.
 */

const API_VERSION = process.env.FB_API_VERSION || 'v21.0'

export function isFacebookConfigured(): boolean {
  return Boolean(process.env.FB_PAGE_ID && process.env.FB_PAGE_ACCESS_TOKEN)
}

interface FacebookLinkPost {
  message: string
  link: string
}

export async function postLinkToFacebook({ message, link }: FacebookLinkPost): Promise<string | null> {
  if (!isFacebookConfigured()) return null

  const pageId = process.env.FB_PAGE_ID as string
  const token = process.env.FB_PAGE_ACCESS_TOKEN as string
  const url = `https://graph.facebook.com/${API_VERSION}/${pageId}/feed`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, link, access_token: token }),
    })
    const data = await res.json()
    if (!res.ok) {
      console.error('Facebook post failed:', data?.error || data)
      return null
    }
    return data.id || null
  } catch (err) {
    console.error('Facebook post error:', err)
    return null
  }
}

/**
 * Post a photo to a Facebook Page (image must be publicly reachable).
 */
export async function postPhotoToFacebook({ imageUrl, caption }: { imageUrl: string; caption: string }): Promise<string | null> {
  if (!isFacebookConfigured()) return null

  const pageId = process.env.FB_PAGE_ID as string
  const token = process.env.FB_PAGE_ACCESS_TOKEN as string
  const url = `https://graph.facebook.com/${API_VERSION}/${pageId}/photos`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: imageUrl, caption, access_token: token }),
    })
    const data = await res.json()
    if (!res.ok) {
      console.error('Facebook photo post failed:', data?.error || data)
      return null
    }
    return data.post_id || data.id || null
  } catch (err) {
    console.error('Facebook photo post error:', err)
    return null
  }
}
