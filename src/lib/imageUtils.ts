/**
 * Sanitizes image URLs, specifically handling Reddit media wrappers.
 * Extracts the direct image URL from reddit.com/media?url=...
 */
export function sanitizeImageUrl(url: string): string {
  if (!url) return '';
  
  try {
    // Handle double encoded URLs and HTML entities
    let decodedUrl = url.replace(/&amp;/g, '&');
    
    // Handle Reddit media proxy URLs
    if (decodedUrl.includes('reddit.com/media') || decodedUrl.includes('www.reddit.com/media')) {
      const urlObj = new URL(decodedUrl);
      const directUrl = urlObj.searchParams.get('url');
      if (directUrl) {
        return decodeURIComponent(directUrl);
      }
    }
    
    // Handle standard reddit preview URLs
    if (decodedUrl.includes('preview.redd.it') && decodedUrl.includes('?')) {
       return decodedUrl;
    }
    
    return decodedUrl;
  } catch (e) {
    console.error('Error sanitizing URL:', e);
  }
  
  return url;
}

/**
 * Checks if a URL points to a video file or a Reddit video-as-gif
 */
export function isVideoUrl(url: string | undefined): boolean {
  if (!url) return false;
  const lowercaseUrl = url.toLowerCase();
  
  return (
    lowercaseUrl.includes('.mp4') || 
    lowercaseUrl.includes('.webm') || 
    lowercaseUrl.includes('.ogg') ||
    lowercaseUrl.includes('.mov') ||
    lowercaseUrl.includes('.gifv') ||
    (lowercaseUrl.includes('preview.redd.it') && lowercaseUrl.includes('format=mp4'))
  );
}
