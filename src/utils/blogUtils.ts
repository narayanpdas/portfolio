import type { BlogPost } from '../types/BlogPost';
import { processImagePath, getImageUrl } from './imageUtils';
import { parseFrontMatter } from './markdownUtils';

// Cache for blog posts
let postsCache: BlogPost[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 5000; // 5 seconds

export async function getBlogPosts(forceRefresh = false): Promise<BlogPost[]> {
  const now = Date.now();
  
  // Return cached posts if they're still fresh and no force refresh is requested
  if (!forceRefresh && now - lastFetchTime < CACHE_DURATION) {
    return postsCache;
  }
  
  const posts: BlogPost[] = [];
  
  try {
    // Using Vite's import.meta.glob to get all markdown files
    const blogFiles = import.meta.glob('../../public/content/blog/*.md', { 
      query: '?raw',
      import: 'default'
    });
    
    for (const path in blogFiles) {
      const file = await blogFiles[path]();
      const slug = path.replace('/src/content/blog/', '').replace('.md', '');
      
      if (typeof file === 'string') {
        const { data, content } = parseFrontMatter(file);
        // Process content to handle image paths
        const processedContent = processImagePath(content);
        
        // Determine a reliable post date: prefer frontmatter date, otherwise use runtime timestamp
        const fallbackTimestamp = new Date().toISOString();
        const parsedDate = data.date ? new Date(String(data.date)) : null;
        const postDate = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : fallbackTimestamp;

        posts.push({
          slug,
          title: data.title || 'Untitled',
          // normalized ISO date string used for sorting and display
          date: postDate,
          content: processedContent,
          excerpt: data.excerpt || (content ? content.slice(0, 150) + '...' : ''),
          tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [String(data.tags)] : []),
          coverImage: data.coverImage ? getImageUrl(String(data.coverImage)) : undefined,
          lastModified: fallbackTimestamp
        });
      }
    }
    
    // Sort posts by date (newest first)
    const sortedPosts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Update cache
    postsCache = sortedPosts;
    lastFetchTime = now;
    
    return sortedPosts;
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}