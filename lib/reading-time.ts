/**
 * Calculate reading time based on 220 words per minute
 */
export function calculateReadingTime(wordCount: number): number {
  return Math.max(1, Math.round(wordCount / 220));
}

/**
 * Count words in an HTML string by stripping tags
 */
export function countWordsFromHtml(html: string): number {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!text) return 0;
  return text.split(/\s+/).length;
}

/**
 * Format numbers with thousand separators
 */
export function formatWords(count: number): string {
  return count.toLocaleString();
}
