// Site configuration for CoreLuminate
export const siteConfig = {
  // Site metadata
  name: 'CoreLuminate',
  description: 'Professional web design, development, and digital marketing services for small businesses',
  url: 'https://www.coreluminate.com',
  
  // Author information
  author: {
    name: 'CoreLuminate',
    email: 'hello@coreluminate.com',
    twitter: '@coreluminate',
  },
  
  // Pagination settings
  pagination: {
    itemsPerPage: 6,
    blog: {
      postsPerPage: 6,
      initialPage: 1,
    },
    work: {
      postsPerPage: 6,
      initialPage: 1,
    },
  },
  
  // Content settings
  content: {
    blog: {
      showDrafts: import.meta.env.DEV, // Show drafts in development only
      sortBy: 'publishDate' as const,
      sortOrder: 'desc' as const,
      defaultAuthor: 'CoreLuminate',
    },
    work: {
      showDrafts: import.meta.env.DEV,
      sortBy: 'order' as const, // Primary sort by order
      sortOrder: 'asc' as const,
    },
  },
  
  // Feature flags
  features: {
    enableComments: false,
    enableSearch: true,
    enableNewsletter: true,
    enableRelatedPosts: true,
  },
  
  // SEO defaults
  seo: {
    defaultImage: '/images/og-default.jpg',
    twitterHandle: '@coreluminate',
  },
} as const;

export type SiteConfig = typeof siteConfig;