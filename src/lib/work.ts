// Work collection utilities
import { getCollection, type CollectionEntry } from 'astro:content';
import { siteConfig } from '../site.config';

export type WorkProject = CollectionEntry<'work'>;

/**
 * Get all work projects, optionally filtered by draft status
 */
export async function getAllWorkProjects(includeDrafts = siteConfig.content.work.showDrafts): Promise<WorkProject[]> {
  const projects = await getCollection('work', ({ data }) => {
    return includeDrafts ? true : !data.draft;
  });
  
  return sortWorkProjects(projects);
}

/**
 * Sort work projects (by order, then by publish date)
 */
export function sortWorkProjects(
  projects: WorkProject[],
  sortBy: 'order' | 'publishDate' = siteConfig.content.work.sortBy,
  order: 'asc' | 'desc' = siteConfig.content.work.sortOrder
): WorkProject[] {
  return projects.sort((a, b) => {
    if (sortBy === 'order') {
      // Primary sort by order
      const orderDiff = a.data.order - b.data.order;
      if (orderDiff !== 0) return order === 'asc' ? orderDiff : -orderDiff;
      
      // Secondary sort by publish date (newest first)
      return b.data.publishDate.getTime() - a.data.publishDate.getTime();
    }
    
    // Sort by publish date
    const dateDiff = a.data.publishDate.getTime() - b.data.publishDate.getTime();
    return order === 'desc' ? -dateDiff : dateDiff;
  });
}

/**
 * Get featured work projects
 */
export async function getFeaturedWorkProjects(limit?: number): Promise<WorkProject[]> {
  const projects = await getAllWorkProjects();
  const featured = projects.filter(project => project.data.featured);
  return limit ? featured.slice(0, limit) : featured;
}

/**
 * Get work projects by service
 */
export async function getWorkProjectsByService(service: string): Promise<WorkProject[]> {
  const projects = await getAllWorkProjects();
  return projects.filter(project =>
    project.data.services.some(s =>
      s.toLowerCase() === service.toLowerCase()
    )
  );
}

/**
 * Get work projects by industry
 */
export async function getWorkProjectsByIndustry(industry: string): Promise<WorkProject[]> {
  const projects = await getAllWorkProjects();
  return projects.filter(project =>
    project.data.industry?.toLowerCase() === industry.toLowerCase()
  );
}

/**
 * Get work projects by company
 */
export async function getWorkProjectsByCompany(company: string): Promise<WorkProject[]> {
  const projects = await getAllWorkProjects();
  return projects.filter(project =>
    project.data.company.toLowerCase() === company.toLowerCase()
  );
}

/**
 * Get work projects by multiple services (OR logic)
 */
export async function getWorkProjectsByServices(services: string[]): Promise<WorkProject[]> {
  const projects = await getAllWorkProjects();
  const normalizedServices = services.map(s => s.toLowerCase());
  
  return projects.filter(project =>
    project.data.services.some(s =>
      normalizedServices.includes(s.toLowerCase())
    )
  );
}

/**
 * Get related work projects based on services and industry
 */
export async function getRelatedWorkProjects(
  currentProject: WorkProject,
  limit = 3
): Promise<WorkProject[]> {
  const allProjects = await getAllWorkProjects();
  
  // Filter out current project using id property
  const otherProjects = allProjects.filter(project => project.id !== currentProject.id);
  
  // Calculate relevance score
  const projectsWithScores = otherProjects.map(project => {
    let score = 0;
    
    // Check service matches
    const serviceMatches = project.data.services.filter(service =>
      currentProject.data.services.includes(service)
    ).length;
    score += serviceMatches * 3;
    
    // Check industry match
    if (project.data.industry && currentProject.data.industry &&
        project.data.industry.toLowerCase() === currentProject.data.industry.toLowerCase()) {
      score += 2;
    }
    
    return { project, score };
  });
  
  // Sort by score and return top results
  return projectsWithScores
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ project }) => project);
}

/**
 * Get recent work projects
 */
export async function getRecentWorkProjects(limit = 6): Promise<WorkProject[]> {
  const projects = await getAllWorkProjects();
  return sortWorkProjects(projects, 'publishDate', 'desc').slice(0, limit);
}

/**
 * Search work projects by title, company, description, or services
 */
export async function searchWorkProjects(query: string): Promise<WorkProject[]> {
  const projects = await getAllWorkProjects();
  const normalizedQuery = query.toLowerCase();
  
  return projects.filter(project => {
    const title = project.data.title.toLowerCase();
    const company = project.data.company.toLowerCase();
    const description = project.data.description.toLowerCase();
    const services = project.data.services.join(' ').toLowerCase();
    const industry = project.data.industry?.toLowerCase() || '';
    
    return (
      title.includes(normalizedQuery) ||
      company.includes(normalizedQuery) ||
      description.includes(normalizedQuery) ||
      services.includes(normalizedQuery) ||
      industry.includes(normalizedQuery)
    );
  });
}

/**
 * Get a single work project by slug
 */
export async function getWorkProjectBySlug(slug: string): Promise<WorkProject | undefined> {
  const projects = await getAllWorkProjects();
  return projects.find(project => project.id === slug);
}

/**
 * Get work projects with testimonials
 */
export async function getWorkProjectsWithTestimonials(): Promise<WorkProject[]> {
  const projects = await getAllWorkProjects();
  return projects.filter(project => project.data.testimonial !== undefined);
}

/**
 * Group work projects by industry
 */
export async function getWorkProjectsByIndustryMap(): Promise<Map<string, WorkProject[]>> {
  const projects = await getAllWorkProjects();
  const projectsByIndustry = new Map<string, WorkProject[]>();
  
  projects.forEach(project => {
    const industry = project.data.industry || 'Other';
    const industryProjects = projectsByIndustry.get(industry) || [];
    industryProjects.push(project);
    projectsByIndustry.set(industry, industryProjects);
  });
  
  return projectsByIndustry;
}