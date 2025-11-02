import React, { useEffect, useState } from 'react';
import { loadProjects } from '../utils/projectsUtils';
import type { ProjectMeta } from '../utils/projectsUtils';
import Loader from '../components/Loader';

const Projects: React.FC = () => {
    const [projects, setProjects] = useState<ProjectMeta[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        void (async () => {
            const list = await loadProjects();
            if (mounted) {
                setProjects(list);
                setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    return (
        <div className="projects">
            <div className="page-title page-title--center">
                <h1>My Work</h1>
            </div>
            <div className="projects-grid">
                {loading && <Loader />}

                {(!loading && projects.length === 0) && (
                    <div className="card">No projects found. Add a project README under <code>src/content/projects/&lt;project-slug&gt;/README.md</code>.</div>
                )}

                {projects.map((p) => {
                    const tags = Array.isArray(p.tags)
                        ? p.tags
                        : p.tags
                            ? String(p.tags).split(',').map(t => t.trim())
                            : [];

                    return (
                        <article key={p.slug || p.title} className="project-card card project-card--compact">
                            {p.image ? (
                                <div className="project-thumb">
                                    <img src={p.image} alt={p.title} />
                                </div>
                            ) : (
                                <div className="project-thumb project-thumb--placeholder" />
                            )}

                            <div className="project-card__body">
                                <h3 className="project-title">{p.title}</h3>
                                {p.description && <p className="project-excerpt">{p.description}</p>}

                                <div className="project-footer">
                                    {tags.length > 0 && (
                                        <div className="project-tags">
                                            {tags.slice(0, 4).map(t => <span key={t} className="tag">{t}</span>)}
                                        </div>
                                    )}

                                    <div className="project-actions">
                                        {p.source && (
                                            <a className="btn btn-ghost" href={p.source} target="_blank" rel="noopener noreferrer">Source</a>
                                        )}
                                        {p.demo && (
                                            <a className="btn btn-primary btn-small" href={p.demo} target="_blank" rel="noopener noreferrer">Demo</a>
                                        )}
                                        {p.track && (
                                            <a className="btn btn-primary btn-small" href={p.track} target="_blank" rel="noopener noreferrer">Track Progress</a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    );
};

export default Projects;