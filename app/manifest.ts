import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pages by Nana',
    short_name: 'Pages',
    description: 'Original fiction, quietly told. Free, distraction-free reading.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FBF8F3',
    theme_color: '#8C2F39',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
