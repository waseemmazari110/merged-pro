import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
          disallow: [
            '/api/',
            '/admin/',
            '/account/',
            '/owner-dashboard/',
            '/owner-login/',
            '/owner-sign-up/',
            '/login/',
            '/register/',
            '/payment/',
            '/booking/',
            '/choose-plan/',
          ],
      },
    ],
    sitemap: 'https://www.groupescapehouses.co.uk/sitemap.xml',
  };
}
