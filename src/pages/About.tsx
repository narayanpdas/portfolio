import React, { useEffect, useState } from 'react';
import { parseFrontMatter } from '../utils/markdownUtils';
import Loader from '../components/Loader';

interface AboutMeta {
    title?: string;
    image?: string;
    resume?: string;
    linkedin?: string;
    github?: string;
    x?: string;
    kaggle?: string;
    email?: string;
    description?: string;
}

const About: React.FC = () => {
    const [meta, setMeta] = useState<AboutMeta | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const aboutRaw = await import('../content/about/README.md?raw');
                const raw = (aboutRaw && (aboutRaw as any).default) ? (aboutRaw as any).default : aboutRaw;
                const { data } = parseFrontMatter(String(raw));
                setMeta(data as AboutMeta);
            } catch (err) {
                console.error('Failed to load about metadata', err);
            } finally {
                setLoading(false);
            }
        };

        void load();
    }, []);

    return (
        <div className="about">
            <div className="page-title page-title--center">
                <h1>{'Who Am I?'}</h1>
            </div>

            <div className="about-card">
                {loading && <Loader />}
                <div className="about-card__content">
                    <h2>{meta?.title || 'About Me'}</h2>
                    <p className="about-intro">
                        {meta?.description || 'Update your description in the README.md frontmatter.'}
                    </p>
                    <div className="about-actions">
                        {meta?.resume && (
                            <a href={meta.resume} download className="btn btn-primary">
                                Download Resume
                            </a>
                        )}

                        <div className="social-links">
                            {meta?.linkedin && (
                                <a href={meta.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                            )}
                            {meta?.github && (
                                <a href={meta.github} target="_blank" rel="noopener noreferrer">GitHub</a>
                            )}
                            {meta?.x && (
                                <a href={meta.x} target="_blank" rel="noopener noreferrer">X</a>
                            )}
                            {meta?.kaggle && (
                                <a href={meta.kaggle} target="_blank" rel="noopener noreferrer">Kaggle</a>
                            )}
                        </div>
                    </div>
                    {meta?.email && (
                        <div className="about-email-row" style={{ marginTop: '1.5rem' }}>
                            <a href={`mailto:${meta.email}`} className="btn btn-primary" style={{}}>
                                Contact Me
                            </a>
                        </div>
                    )}
                </div>

                <div className="about-card__image">
                    {meta?.image ? (
                        <img src={meta.image} alt="Profile" className="about-profile-img" />
                    ) : (
                        <div className="avatar-placeholder" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default About;