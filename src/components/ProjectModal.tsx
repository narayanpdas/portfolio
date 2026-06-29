import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { parseFrontMatter } from '../utils/markdownUtils';

type Props = {
    open: boolean;
    onClose: () => void;
    title?: string;
    slug?: string;
    content?: string | null;
    source?: string;
    live_link?: string;
    track?: string;
    tags?: string[] | string;
};

const ProjectModal: React.FC<Props> = ({ open, onClose, title, content, source, live_link, track, tags }) => {
    const modalRef = useRef<HTMLDivElement | null>(null);

    // Prevent background scroll while modal is open
    useEffect(() => {
        if (open) {
            const prev = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = prev; };
        }
        return;
    }, [open]);

    // Close on Escape
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    // Focus management: focus modal container when opened and restore previous focus on close
    useEffect(() => {
        if (!open) return;
        const prevActive = document.activeElement as HTMLElement | null;
        const node = modalRef.current;
        if (node) node.focus();
        return () => { if (prevActive && typeof prevActive.focus === 'function') prevActive.focus(); };
    }, [open]);

    if (!open) return null;
    return (
        <div className="project-modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
            <div ref={modalRef} tabIndex={-1} className="project-modal" onClick={(e) => e.stopPropagation()}>
                {/* Top row: tags on the left, action buttons on the right */}
                <div className="project-modal__top">
                    <div className="project-modal__meta">
                        {tags && (
                            <div className="tags">
                                {(Array.isArray(tags) ? tags : String(tags).split(',')).map((t) => (
                                    <span key={t} className="tag">{t}</span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="project-modal__actions">
                        {live_link && <a className="btn btn-primary" href={live_link} target="_blank" rel="noopener noreferrer">live_link-link</a>}
                        {track && <a className="btn btn-primary" href={track} target="_blank" rel="noopener noreferrer">Track Progress</a>}
                        {source && <a className="btn btn-ghost" href={source} target="_blank" rel="noopener noreferrer">Source</a>}
                        <button className="btn btn-ghost" onClick={onClose} aria-label="Close">Close</button>
                    </div>
                </div>

                <header className="project-modal__header">
                    <h2>{title}</h2>
                </header>
                <div className="project-modal__content">
                    {content === null ? (
                        <p>Loading details...</p>
                    ) : ((): React.ReactNode => {
                        try {
                            const parsed = parseFrontMatter(String(content || ''));
                            const md = parsed.content && parsed.content.trim() ? parsed.content : null;
                            if (!md) return <p>No additional details available for this project.</p>;
                            return (
                                <ReactMarkdown
                                    components={{
                                        img: ({ node, src, alt, ...props }) => (
                                            <img
                                                className="project-modal__image"
                                                src={String(src)}
                                                alt={String(alt)}
                                                loading="lazy"
                                                {...props}
                                            />
                                        ),
                                        a: ({ node, href, children, ...props }) => (
                                            <a href={href} target={String(href)?.startsWith('http') ? '_blank' : undefined} rel={String(href)?.startsWith('http') ? 'noopener noreferrer' : undefined} {...props}>
                                                {children}
                                            </a>
                                        )
                                    }}
                                >
                                    {md}
                                </ReactMarkdown>
                            );
                        } catch (err) {
                            return <p>No additional details available for this project.</p>;
                        }
                    })()}
                </div>
            </div>
        </div>
    );
};

export default ProjectModal;
