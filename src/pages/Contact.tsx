import React, { useState, useEffect } from 'react';
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
const Contact: React.FC = () => {
    const [copied, setCopied] = useState(false);
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
    const handleCopy = () => {
        if (meta?.email) {
            navigator.clipboard.writeText(meta.email);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        }
    };
    const SOCIALS: { name: string; url: string }[] = meta
        ? [
            meta.linkedin ? { name: 'LinkedIn', url: meta.linkedin } : null,
            meta.github ? { name: 'GitHub', url: meta.github } : null,
            meta.x ? { name: 'X', url: meta.x } : null,
            meta.kaggle ? { name: 'Kaggle', url: meta.kaggle } : null
        ].filter((s): s is { name: string; url: string } => !!s)
        : [];

    return (
        <div className="contact">
            <div className="page-title page-title--center">
                <h1>Contact Me</h1>
            </div>
            <div className="contact-card">
                {loading && <Loader />}
                <div className="contact-info">
                    <p className="contact-intro">
                        I'm always open to new opportunities, collaborations, or just a friendly chat. Feel free to reach out!
                    </p>
                    <div className="contact-email-row">
                        <span className="contact-label">Email:</span>
                        <span className="contact-email">{meta?.email || "[email not found]"}</span>
                        <button className="btn btn-secondary" onClick={handleCopy} title="Copy email">
                            {copied ? "Copied!" : "Copy"}
                        </button>
                        <a
                            href={`mailto:${meta?.email || ""}`}
                            className="btn btn-primary"
                            style={{ marginLeft: '0.5rem' }}
                        >
                            Contact Me
                        </a>
                    </div>
                    <div className="contact-socials">
                        {SOCIALS.map(s => (
                            <a
                                key={s.name}
                                href={s.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contact-social-link"
                            >
                                {s.name}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;