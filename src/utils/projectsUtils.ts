import { parseFrontMatter } from './markdownUtils';

export interface ProjectMeta {
  title?: string;
  description?: string;
  source?: string;
  demo?: string;
  track?:string;
  image?: string;
  tags?: string | string[];
  slug?: string;
  order?: number;
  date?: string;
}

export async function loadProjects(): Promise<ProjectMeta[]> {
  // Single eager glob: look for README.md files under src/content/projects/**
  const modules = import.meta.glob('../content/projects/**/README.md?raw', { eager: true }) as Record<string, any>;
  console.log(modules)
  const projects: ProjectMeta[] = [];

  // Temporary debug: list matched module keys
  try {
    // eslint-disable-next-line no-console
    console.debug('[projectsUtils] glob keys', Object.keys(modules || {}));
  } catch {}



  // If the glob returns nothing (some dev setups), try a dynamic import fallback

  // First process entries from the glob


  // Then attempt to import explicit sample READMEs to cover cases where glob misses them


  // sort by frontmatter: order (asc), date (newest first), then title
  projects.sort((a, b) => {
    const aOrder = (a as any).order ?? Number.POSITIVE_INFINITY;
    const bOrder = (b as any).order ?? Number.POSITIVE_INFINITY;
    if (aOrder !== bOrder) return aOrder - bOrder;

    const aDate = a.date ? Date.parse(String((a as any).date)) : 0;
    const bDate = b.date ? Date.parse(String((b as any).date)) : 0;
    if (aDate !== bDate) return bDate - aDate;

    return (a.title || '').localeCompare(b.title || '');
  });

  return projects;
}
