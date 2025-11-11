import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    author: z.string().default('CoreLuminate Team'),

    readTime: z.number().optional(),
    featured: z.boolean().default(false),
    featuredImage: z.object({
      url: image(),
      alt: z.string().optional()
    }).optional(),
    draft: z.boolean().default(false),

    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
  }),
});

const workCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    // Basic Info
    title: z.string(),
    company: z.string(),
    description: z.string(),
    
    // Project Details
    services: z.array(z.string()), // ["Website Design", "SEO", "Branding"]
    industry: z.string(), // "Consulting", "E-commerce", "Healthcare"
    projectUrl: z.string().url().optional(), // Live website URL
    
    // Images
    featuredImage: image(), // Main project image
    images: z.array(image()).optional(), // Additional screenshots
    
    // Metrics/Results
    stats: z.array(z.object({
      value: z.string(), // "180%", "2 Weeks", "$50K"
      label: z.string(), // "Increase in Leads", "Project Timeline"
    })).optional(),
    
    // Testimonial
    testimonial: z.object({
      quote: z.string(),
      author: z.string(),
      role: z.string(),
    }).optional(),
    
    // Metadata
    featured: z.boolean().default(false), // Flag for homepage
    order: z.number().default(999), // Order for featured projects
    publishDate: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});



export const collections = { 
  blog: blogCollection, 
  work: workCollection 
};