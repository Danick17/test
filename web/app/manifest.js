export default function manifest() {
  return {
    name: 'Bestmark — Every best. On the record.',
    short_name: 'Bestmark',
    description: 'One profile for all your personal records across running, swimming, cycling, and triathlon.',
    id: '/',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F1E2E',
    theme_color: '#0F1E2E',
    orientation: 'portrait',
    categories: ['sports', 'fitness', 'health'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
