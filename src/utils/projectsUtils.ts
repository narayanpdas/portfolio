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

  const projects: ProjectMeta[] = [];

  // Temporary debug: list matched module keys
  try {
    // eslint-disable-next-line no-console
    console.debug('[projectsUtils] glob keys', Object.keys(modules || {}));
  } catch {}

  const addedSlugs = new Set<string>();

  // If the glob returns nothing (some dev setups), try a dynamic import fallback

  // First process entries from the glob
  for (const [path, mod] of Object.entries(modules)) {
    try {
      const raw = (mod && (mod as any).default) ? (mod as any).default : mod;
      const { data } = parseFrontMatter(String(raw));

      const parts = path.split('/');
      const idx = parts.findIndex(p => p === 'projects');
      const slug = idx >= 0 && parts.length > idx + 1 ? parts[idx + 1] : undefined;

      const meta: ProjectMeta = {
        ...(data || {}),
        slug
      };

      if (meta.tags && !Array.isArray(meta.tags) && typeof meta.tags === 'string') {
        meta.tags = meta.tags.split(',').map((t: string) => t.trim());
      }
      if (slug) addedSlugs.add(slug);
      projects.push(meta);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to load project at', path, err);
    }
  }

  // Then attempt to import explicit sample READMEs to cover cases where glob misses them
  for (const samplePath of ['../content/projects/sample-app-1/README.md?raw', '../content/projects/sample-app-2/README.md?raw']) {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const mod = await import(samplePath);
      const raw = (mod && (mod as any).default) ? (mod as any).default : mod;
      const { data } = parseFrontMatter(String(raw));
      const slugMatch = samplePath.match(/projects\/(.+?)\/README\.md/);
      const slug = slugMatch ? slugMatch[1] : undefined;
      if (slug && !addedSlugs.has(slug)) {
        const meta: ProjectMeta = { ...(data || {}), slug };
        if (meta.tags && !Array.isArray(meta.tags) && typeof meta.tags === 'string') {
          meta.tags = meta.tags.split(',').map((t: string) => t.trim());
        }
        projects.push(meta);
        addedSlugs.add(slug);
      }
    } catch (e) {
      // ignore missing sample imports
    }
  }

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
