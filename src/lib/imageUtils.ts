/**
 * Sanitizes image URLs, specifically handling Reddit media wrappers.
 * Extracts the direct image URL from reddit.com/media?url=...
 */
export function sanitizeImageUrl(url: string): string {
  if (!url) return '';
  
  try {
    // Handle Reddit media proxy URLs
    if (url.includes('reddit.com/media') || url.includes('www.reddit.com/media')) {
      const urlObj = new URL(url);
      const directUrl = urlObj.searchParams.get('url');
      if (directUrl) {
        return decodeURIComponent(directUrl);
      }
    }
    
    // Handle standard reddit preview URLs that might be encoded
    if (url.includes('preview.redd.it') && url.includes('?')) {
       // Just ensure it's not double encoded or something weird
       return url;
    }
  } catch (e) {
    console.error('Error sanitizing URL:', e);
  }
  
  return url;
}
