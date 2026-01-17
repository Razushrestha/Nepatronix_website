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
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
