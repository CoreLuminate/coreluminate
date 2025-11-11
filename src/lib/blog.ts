// Blog collection utilities
import { getCollection, type CollectionEntry } from 'astro:content';
import { siteConfig } from '../site.config';

export type BlogPost = CollectionEntry<'blog'>;

/**
 * Get all blog posts, optionally filtered by draft status
 */
export async function getAllBlogPosts(includeDrafts = siteConfig.content.blog.showDrafts): Promise<BlogPost[]> {
  const posts = await getCollection('blog', ({ data }) => {
    return includeDrafts ? true : !data.draft;
  });
  
  return sortBlogPosts(posts);
}

/**
 * Sort blog posts by publish date (newest first by default)
 */
export function sortBlogPosts(
  posts: BlogPost[],
  sortBy: 'publishDate' | 'title' = siteConfig.content.blog.sortBy,
  order: 'asc' | 'desc' = siteConfig.content.blog.sortOrder
): BlogPost[] {
  return posts.sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'publishDate') {
      comparison = a.data.publishDate.getTime() - b.data.publishDate.getTime();
    } else if (sortBy === 'title') {
      comparison = a.data.title.localeCompare(b.data.title);
    }
    
    return order === 'desc' ? -comparison : comparison;
  });
}

/**
 * Get featured blog posts
 */
export async function getFeaturedBlogPosts(limit?: number): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  const featured = posts.filter(post => post.data.featured);
  return limit ? featured.slice(0, limit) : featured;
}

/**
 * Get blog posts by category
 */
export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  return posts.filter(post => 
    post.data.categories.some(cat => 
      cat.toLowerCase() === category.toLowerCase()
    )
  );
}

/**
 * Get blog posts by tag
 */
export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  return posts.filter(post => 
    post.data.tags.some(t => 
      t.toLowerCase() === tag.toLowerCase()
    )
  );
}

/**
 * Get blog posts by multiple tags (OR logic)
 */
export async function getBlogPostsByTags(tags: string[]): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  const normalizedTags = tags.map(t => t.toLowerCase());
  
  return posts.filter(post =>
    post.data.tags.some(t =>
      normalizedTags.includes(t.toLowerCase())
    )
  );
}

/**
 * Get blog posts by author
 */
export async function getBlogPostsByAuthor(author: string): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  return posts.filter(post => 
    post.data.author.toLowerCase() === author.toLowerCase()
  );
}

/**
 * Get related blog posts based on categories and tags
 */
export async function getRelatedBlogPosts(
  currentPost: BlogPost,
  limit = 3
): Promise<BlogPost[]> {
  const allPosts = await getAllBlogPosts();
  
  // Filter out current post
  const otherPosts = allPosts.filter(post => post.id !== currentPost.id);
  
  // Calculate relevance score
  const postsWithScores = otherPosts.map(post => {
    let score = 0;
    
    // Check category matches
    const categoryMatches = post.data.categories.filter(cat =>
      currentPost.data.categories.includes(cat)
    ).length;
    score += categoryMatches * 3; // Categories worth more
    
    // Check tag matches
    const tagMatches = post.data.tags.filter(tag =>
      currentPost.data.tags.includes(tag)
    ).length;
    score += tagMatches * 2;
    
    return { post, score };
  });
  
  // Sort by score and return top results
  return postsWithScores
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);
}

/**
 * Get recent blog posts
 */
export async function getRecentBlogPosts(limit = 5): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  return posts.slice(0, limit);
}

/**
 * Search blog posts by title, description, or content
 */
export async function searchBlogPosts(query: string): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  const normalizedQuery = query.toLowerCase();
  
  return posts.filter(post => {
    const title = post.data.title.toLowerCase();
    const description = post.data.description.toLowerCase();
    const categories = post.data.categories.join(' ').toLowerCase();
    const tags = post.data.tags.join(' ').toLowerCase();
    
    return (
      title.includes(normalizedQuery) ||
      description.includes(normalizedQuery) ||
      categories.includes(normalizedQuery) ||
      tags.includes(normalizedQuery)
    );
  });
}

/**
 * Get a single blog post by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const posts = await getAllBlogPosts();
  return posts.find(post => post.id === slug);
}

/**
 * Group blog posts by year
 */
export async function getBlogPostsByYear(): Promise<Map<number, BlogPost[]>> {
  const posts = await getAllBlogPosts();
  const postsByYear = new Map<number, BlogPost[]>();
  
  posts.forEach(post => {
    const year = post.data.publishDate.getFullYear();
    const yearPosts = postsByYear.get(year) || [];
    yearPosts.push(post);
    postsByYear.set(year, yearPosts);
  });
  
  return postsByYear;
}

/**
 * Calculate reading time if not provided
 */
export function calculateReadingTime(content: string, wordsPerMinute = 200): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}