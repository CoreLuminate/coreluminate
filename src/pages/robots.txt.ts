import type { APIRoute } from 'astro';

const getRobotsTxt = (sitemapURL: URL) => `\
User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    return new Response('Site is not defined', { status: 500 });
  }

  const sitemapURL = new URL('/sitemap-index.xml', site);
  const robotsTxt = getRobotsTxt(sitemapURL);

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
};  