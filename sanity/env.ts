export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-16'

// Keep safe fallbacks for Studio runtime so it doesn't fail with empty config.
// These can still be overridden by environment variables in each deployment.
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'nnwsol6o'
export const token = process.env.SANITY_API_TOKEN

export const useCdn = false
