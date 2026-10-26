import { MetadataRoute } from 'next';
import { SAMPLE_BOOKS } from '@/lib/sample-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pagesbynana.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date() },
    { url: `${baseUrl}/books`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/support`, lastModified: new Date() },
    { url: `${baseUrl}/privacy`, lastModified: new Date() },
  ];

  const bookRoutes: MetadataRoute.Sitemap = SAMPLE_BOOKS.map((b) => ({
    url: `${baseUrl}/books/${b.slug}`,
    lastModified: new Date(),
  }));

  const chapterRoutes: MetadataRoute.Sitemap = SAMPLE_BOOKS.flatMap((b) =>
    (b.chapters || []).map((c) => ({
      url: `${baseUrl}/books/${b.slug}/${c.slug}`,
      lastModified: new Date(),
    }))
  );

  return [...staticRoutes, ...bookRoutes, ...chapterRoutes];
}
