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
  const modules = import.meta.glob('../content/projects/**/README.md', 
    { eager: true,query:'?raw' ,import:'default'}) as Record<string, string>;
  const projects: ProjectMeta[] = [];
  console.log('[projectsUtils] glob keys', Object.keys(modules || {}));
 try {
    console.debug('[projectsUtils] glob keys', Object.keys(modules || {}));

  } catch {}
  const addedSlugs = new Set<string>();

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
      console.error('Failed to load project at', path, err);
    }

  }


  try {
  } catch {}
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
