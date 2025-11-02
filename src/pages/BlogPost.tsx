import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import type { BlogPost } from '../types/BlogPost';
import { getBlogPosts } from '../utils/blogUtils';
import Loader from '../components/Loader';

const BlogPostPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPost = async () => {
            if (!slug) {
                navigate('/blog');
                return;
            }

            const posts = await getBlogPosts();
            const foundPost = posts.find(p => p.slug === slug);

            if (foundPost) {
                setPost(foundPost);
            } else {
                navigate('/blog');
            }
            setLoading(false);
        };

        loadPost();
    }, [slug, navigate]);

    if (loading) {
        return <Loader />;
    }

    if (!post) {
        return null;
    }

    return (
        <div className="blog-post">
            <article>
                <header>
                    <h1>{post.title}</h1>
                    <div className="post-meta">
                        {post.tags && post.tags.length > 0 && (
                            <div className="tags">
                                {post.tags.map((tag) => (
                                    <span key={tag} className="tag">{tag}</span>
                                ))}
                            </div>
                        )}

                        <time aria-label={`Published ${new Date(post.date).toLocaleDateString()}`}>{new Date(post.date).toLocaleDateString()}</time>
                    </div>
                </header>
                <div className="post-content">
                    <ReactMarkdown
                        components={{
                            img: ({ node, src, alt, ...props }) => (
                                <img
                                    src={src}
                                    alt={alt}
                                    loading="lazy"
                                    style={{ maxWidth: '100%', height: 'auto' }}
                                    {...props}
                                />
                            ),
                            a: ({ node, href, children, ...props }) => (
                                <a
                                    href={href}
                                    target={href?.startsWith('http') ? '_blank' : undefined}
                                    rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                                    {...props}
                                >
                                    {children}
                                </a>
                            )
                        }}
                    >
                        {post.content}
                    </ReactMarkdown>
                </div>
            </article>
        </div>
    );
};

export default BlogPostPage;