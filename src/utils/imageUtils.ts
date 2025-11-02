export const processImagePath = (content: string): string => {
  // Convert relative image paths to absolute URLs
  return content.replace(
    /!\[(.*?)\]\(\/src\/content\/assets\/(.*?)\)/g,
    '![$1](/content/assets/$2)'
  );
};

export const getImageUrl = (path: string): string => {
  if (path.startsWith('http')) {
    return path;
  }
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return new URL(`/${cleanPath}`, window.location.origin).toString();
};