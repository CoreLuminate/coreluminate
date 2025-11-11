// Taxonomy utilities for categories, tags, services, and industries
import { getAllBlogPosts, type BlogPost } from './blog';
import { getAllWorkProjects, type WorkProject } from './work';

export interface TaxonomyItem {
  name: string;
  slug: string;
  count: number;
}

export interface CategoryWithPosts extends TaxonomyItem {
  posts: BlogPost[];
}

export interface TagWithPosts extends TaxonomyItem {
  posts: BlogPost[];
}

export interface ServiceWithProjects extends TaxonomyItem {
  projects: WorkProject[];
}

export interface IndustryWithProjects extends TaxonomyItem {
  projects: WorkProject[];
}

/**
 * Convert string to URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Get all unique categories from blog posts
 */
export async function getAllCategories(): Promise<TaxonomyItem[]> {
  const posts = await getAllBlogPosts();
  const categoryMap = new Map<string, number>();
  
  posts.forEach(post => {
    post.data.categories.forEach(category => {
      const normalizedCategory = category.toLowerCase();
      categoryMap.set(
        normalizedCategory,
        (categoryMap.get(normalizedCategory) || 0) + 1
      );
    });
  });
  
  return Array.from(categoryMap.entries())
    .map(([name, count]) => ({
      name,
      slug: slugify(name),
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get categories with their associated posts
 */
export async function getCategoriesWithPosts(): Promise<CategoryWithPosts[]> {
  const posts = await getAllBlogPosts();
  const categoryMap = new Map<string, BlogPost[]>();
  
  posts.forEach(post => {
    post.data.categories.forEach(category => {
      const normalizedCategory = category.toLowerCase();
      const categoryPosts = categoryMap.get(normalizedCategory) || [];
      categoryPosts.push(post);
      categoryMap.set(normalizedCategory, categoryPosts);
    });
  });
  
  return Array.from(categoryMap.entries())
    .map(([name, posts]) => ({
      name,
      slug: slugify(name),
      count: posts.length,
      posts,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get all unique tags from blog posts
 */
export async function getAllTags(): Promise<TaxonomyItem[]> {
  const posts = await getAllBlogPosts();
  const tagMap = new Map<string, number>();
  
  posts.forEach(post => {
    post.data.tags.forEach(tag => {
      const normalizedTag = tag.toLowerCase();
      tagMap.set(
        normalizedTag,
        (tagMap.get(normalizedTag) || 0) + 1
      );
    });
  });
  
  return Array.from(tagMap.entries())
    .map(([name, count]) => ({
      name,
      slug: slugify(name),
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get tags with their associated posts
 */
export async function getTagsWithPosts(): Promise<TagWithPosts[]> {
  const posts = await getAllBlogPosts();
  const tagMap = new Map<string, BlogPost[]>();
  
  posts.forEach(post => {
    post.data.tags.forEach(tag => {
      const normalizedTag = tag.toLowerCase();
      const tagPosts = tagMap.get(normalizedTag) || [];
      tagPosts.push(post);
      tagMap.set(normalizedTag, tagPosts);
    });
  });
  
  return Array.from(tagMap.entries())
    .map(([name, posts]) => ({
      name,
      slug: slugify(name),
      count: posts.length,
      posts,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get all unique services from work projects
 */
export async function getAllServices(): Promise<TaxonomyItem[]> {
  const projects = await getAllWorkProjects();
  const serviceMap = new Map<string, number>();
  
  projects.forEach(project => {
    project.data.services.forEach(service => {
      const normalizedService = service.toLowerCase();
      serviceMap.set(
        normalizedService,
        (serviceMap.get(normalizedService) || 0) + 1
      );
    });
  });
  
  return Array.from(serviceMap.entries())
    .map(([name, count]) => ({
      name,
      slug: slugify(name),
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get services with their associated projects
 */
export async function getServicesWithProjects(): Promise<ServiceWithProjects[]> {
  const projects = await getAllWorkProjects();
  const serviceMap = new Map<string, WorkProject[]>();
  
  projects.forEach(project => {
    project.data.services.forEach(service => {
      const normalizedService = service.toLowerCase();
      const serviceProjects = serviceMap.get(normalizedService) || [];
      serviceProjects.push(project);
      serviceMap.set(normalizedService, serviceProjects);
    });
  });
  
  return Array.from(serviceMap.entries())
    .map(([name, projects]) => ({
      name,
      slug: slugify(name),
      count: projects.length,
      projects,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get all unique industries from work projects
 */
export async function getAllIndustries(): Promise<TaxonomyItem[]> {
  const projects = await getAllWorkProjects();
  const industryMap = new Map<string, number>();
  
  projects.forEach(project => {
    if (project.data.industry) {
      const normalizedIndustry = project.data.industry.toLowerCase();
      industryMap.set(
        normalizedIndustry,
        (industryMap.get(normalizedIndustry) || 0) + 1
      );
    }
  });
  
  return Array.from(industryMap.entries())
    .map(([name, count]) => ({
      name,
      slug: slugify(name),
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get industries with their associated projects
 */
export async function getIndustriesWithProjects(): Promise<IndustryWithProjects[]> {
  const projects = await getAllWorkProjects();
  const industryMap = new Map<string, WorkProject[]>();
  
  projects.forEach(project => {
    if (project.data.industry) {
      const normalizedIndustry = project.data.industry.toLowerCase();
      const industryProjects = industryMap.get(normalizedIndustry) || [];
      industryProjects.push(project);
      industryMap.set(normalizedIndustry, industryProjects);
    }
  });
  
  return Array.from(industryMap.entries())
    .map(([name, projects]) => ({
      name,
      slug: slugify(name),
      count: projects.length,
      projects,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Find taxonomy item by slug
 */
export function findTaxonomyBySlug(
  taxonomyItems: TaxonomyItem[],
  slug: string
): TaxonomyItem | undefined {
  return taxonomyItems.find(item => item.slug === slug);
}

/**
 * Get popular tags (top N by count)
 */
export async function getPopularTags(limit = 10): Promise<TaxonomyItem[]> {
  const tags = await getAllTags();
  return tags.slice(0, limit);
}

/**
 * Get popular categories (top N by count)
 */
export async function getPopularCategories(limit = 10): Promise<TaxonomyItem[]> {
  const categories = await getAllCategories();
  return categories.slice(0, limit);
}