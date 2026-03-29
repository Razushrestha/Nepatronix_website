import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nepatronix Engineering Solutions',
    short_name: 'Nepatronix',
    description: 'Nepatronix provides hands-on IoT, Robotics, Arduino & PCB training in Nepal.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#C1121F',
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
