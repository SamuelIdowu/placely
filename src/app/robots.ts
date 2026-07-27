import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://placely.ng';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/*', '/api/*', '/student/*', '/employer/*', '/dashboard/*'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
