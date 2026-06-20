import type { MetadataRoute } from 'next'

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Taxi Saver Thailand',
    short_name: 'Taxi Saver',
    description: 'Taxi Saver Thailand — affordable ride-hailing services across Thailand with no deposit required.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1DA58C',
    theme_color: '#1DA58C',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
