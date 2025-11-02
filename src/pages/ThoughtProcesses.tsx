import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { BlogPost } from '../types/BlogPost';
import { getBlogPosts } from '../utils/blogUtils';
import Loader from '../components/Loader';
import './styles.css'

const ThoughtProcesses: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

    useEffect(() => {
        const loadPosts = async () => {
            const blogPosts = await getBlogPosts(true); // Force refresh on mount
            setPosts(blogPosts);
            setLoading(false);
        };

        // Load posts immediately
        loadPosts();

        // Set up periodic refresh
        const refreshInterval = setInterval(async () => {
            const updatedPosts = await getBlogPosts();
            setPosts(updatedPosts);
        }, 5000); // Check for new posts every 5 seconds

        // Cleanup interval on unmount
        return () => clearInterval(refreshInterval);
    }, []);

    if (loading) {
        return <Loader />;
    }

    // Filter & sort posts based on searchQuery and sortOrder
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filtered = posts.filter((p) => {
        if (!normalizedQuery) return true;
        const inTitle = p.title.toLowerCase().includes(normalizedQuery);
        const inExcerpt = (p.excerpt || '').toLowerCase().includes(normalizedQuery);
        const inContent = (p.content || '').toLowerCase().includes(normalizedQuery);
        const inTags = (p.tags || []).some(t => String(t).toLowerCase().includes(normalizedQuery));
        return inTitle || inExcerpt || inContent || inTags;
    });

    const filteredPosts = filtered.sort((a, b) => {
        const ta = new Date(a.date).getTime();
        const tb = new Date(b.date).getTime();
        return sortOrder === 'newest' ? tb - ta : ta - tb;
    });

    return (
        <div className="thought-processes">
            <div className="page-header">
                <h1>My Mind-Map</h1>
                {/* <div>
                    <div className="loader">
                        <span><span></span><span></span><span></span><span></span></span>
                        <div className="base">
                            <span></span>
                            <div className="face"></div>
                        </div>
                    </div>
                </div> */}
                <div className="blog-controls">
                    <input
                        type="search"
                        placeholder="Search posts by title, tag or content..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Search blog posts"
                        className="blog-search"
                    />

                    <label htmlFor="sortOrder" className="visually-hidden">Sort posts</label>
                    <select
                        id="sortOrder"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                        className="blog-sort"
                        aria-label="Sort blog posts"
                    >
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                    </select>
                </div>
            </div>

            <div className="blog-posts">
                {filteredPosts.length === 0 ? (
                    <p>No blog posts found. Try a different search or add markdown files to the src/content/blog directory!</p>
                ) : (
                    filteredPosts.map((post) => (
                        <article key={post.slug} className="blog-post-card">
                            <h2>{post.title}</h2>
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
                            <p className="excerpt">{post.excerpt}</p>
                            <Link to={`/blog/${post.slug}`} className="read-more">
                                Read More
                            </Link>
                        </article>
                    ))
                )}
            </div>
        </div >
    );
};

export default ThoughtProcesses;