import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nepatronix Engineeering Solution',
    short_name: 'Nepatronix',
    description: 'Nepatronix provides hands-on IoT, Robotics, Arduino & PCB training in Nepal.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#C1121F',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon',
      },
      {
        src: '/title.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/title.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
