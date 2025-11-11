/**
 * Format date for display
 */
export function formatDate(date: Date, format: 'short' | 'long' | 'medium' = 'medium'): string {
  const optionsMap= {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    medium: { month: 'long', day: 'numeric', year: 'numeric' },
    long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
  } as Record<'short' | 'medium' | 'long', Intl.DateTimeFormatOptions>;

  const options = optionsMap[format];
  
  return date.toLocaleDateString('en-US', options);
}

/**
 * Converts a string into a URL-friendly slug.
 * e.g., "Web Design" -> "web-design"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}