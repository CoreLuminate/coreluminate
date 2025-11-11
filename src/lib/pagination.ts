
import { siteConfig } from '../site.config';

// Pagination utilities for blog and work collections
export interface PaginatedResult<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
  firstPage: number;
  lastPage: number;
  startIndex: number;
  endIndex: number;
}

/**
 * Paginate an array of items
 */
export function paginate<T>(
  items: T[],
  currentPage = 1,
  itemsPerPage = 10
): PaginatedResult<T> {
  const totalItems = items.length;
  const totalPages = totalItems === 0 ? 1 : Math.ceil(totalItems / itemsPerPage);
  
  // Ensure current page is within bounds
  const page = Math.max(1, Math.min(currentPage, totalPages || 1));
  
  // Calculate slice indices
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  
  // Get paginated data
  const data = items.slice(startIndex, endIndex);
  
  return {
    data,
    currentPage: page,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
    firstPage: 1,
    lastPage: totalPages,
    startIndex,
    endIndex,
  };
}

export function paginateItems<T>(
  items: T[],
  currentPage: number = 1,
  itemsPerPage: number = siteConfig.pagination.itemsPerPage
): PaginatedResult<T> {
  return paginate(items, currentPage, itemsPerPage)
}

/**
 * Generate paginatino URLs
 */
export function generatePaginationUrls(
  currentPage: number,
  totalPages: number,
  baseUrl: string
): {
  prevUrl: string | null;
  nextUrl: string | null;
  pageUrls: string[];
} {
  const pageUrls = Array.from({ length: totalPages }, (_, i) => {
    const page = i + 1;
    return page === 1 ? baseUrl : `${baseUrl}/${page}`;
  });
  
  const prevUrl = currentPage > 1 
    ? (currentPage === 2 ? baseUrl : `${baseUrl}/${currentPage - 1}`)
    : null;
    
  const nextUrl = currentPage < totalPages 
    ? `${baseUrl}/${currentPage + 1}`
    : null;
  
  return { prevUrl, nextUrl, pageUrls };
}

/**
 * Get static paths for paginated routes
 * Used in Astro's getStaticPaths for [page].astro
 */
export function getPaginatedPaths<T>(
  items: T[],
  itemsPerPage: number
): Array<{ params: { page: string | undefined }; props: PaginatedResult<T> }> {
  const totalPages = Math.ceil(items.length / itemsPerPage);
  
  return Array.from({ length: totalPages }, (_, i) => {
    const page = i + 1;
    
    return {
      params: { 
        page: page === 1 ? undefined : page.toString() 
      },
      props: paginate(items, page, itemsPerPage),
    };
  });
}

/**
 * Calculate page range info for display
 * e.g., "Showing 1-10 of 50 posts"
 */
export function getPageRangeInfo(pagination: PaginatedResult<any>): string {
  const { startIndex, endIndex, totalItems } = pagination;
  
  if (totalItems === 0) return 'No items found';
  
  const start = startIndex + 1;
  const end = endIndex;
  
  return `Showing ${start}-${end} of ${totalItems}`;
}