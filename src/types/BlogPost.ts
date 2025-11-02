export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  content: string;
  excerpt: string;
  tags: string[];  // Make tags non-optional but always an array (empty if no tags)
  coverImage?: string;
  lastModified?: string;
}