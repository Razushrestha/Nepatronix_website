import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, token, useCdn } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  token, // Add token for write operations
  perspective: 'published',
})
