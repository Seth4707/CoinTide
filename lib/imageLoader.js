export default function myImageLoader({ src, width, quality }) {
  // Return the src with width parameter for local images
  if (src.startsWith('/')) {
    // For local images, just return the src
    return src;
  }
  
  // For remote images, you might want to add width parameter
  // This is a simple example - adjust based on your needs
  return `${src}?w=${width || ''}${quality ? `&q=${quality}` : ''}`;
}
