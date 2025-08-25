import { useState, useEffect } from 'react';
import './Updates.css';

export const Updates = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${process.env.PUBLIC_URL}/data/posts.json?t=${Date.now()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }
      
      const data = await response.json();
      setPosts(data.posts || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      
      // Fallback to empty state with helpful message
      setPosts([]);
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const renderPost = (post) => {
    switch (post.type) {
      case 'image':
        return (
          <div className="post-content">
            {post.content && <p>{post.content}</p>}
            <img src={post.mediaUrl} alt="Posted content" className="post-image" />
          </div>
        );
      
      case 'video':
        return (
          <div className="post-content">
            {post.content && <p>{post.content}</p>}
            <video src={post.mediaUrl} controls className="post-video" />
          </div>
        );
      
      case 'link':
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const textWithLinks = post.content.replace(urlRegex, (url) => 
          `<a href="${url}" target="_blank" rel="noopener noreferrer" class="post-link">${url}</a>`
        );
        return (
          <div className="post-content">
            <p dangerouslySetInnerHTML={{ __html: textWithLinks }} />
          </div>
        );
      
      default:
        return (
          <div className="post-content">
            <p>{post.content}</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="updates-container">
        <h2>Updates</h2>
        <div className="loading">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="updates-container">
      <div className="updates-header">
        <h2>Updates</h2>
        <p className="updates-subtitle">Latest thoughts and discoveries</p>
      </div>
      
      <div className="posts-feed">
        {posts.length === 0 ? (
          <div className="no-posts">
            <p>No updates yet. Send a text to get started!</p>
          </div>
        ) : (
          posts.map(post => (
            <article key={post.id} className="post">
              <div className="post-header">
                <time className="post-date">{formatDate(post.timestamp)}</time>
              </div>
              {renderPost(post)}
            </article>
          ))
        )}
      </div>
      
      <div className="updates-footer">
        <p>✨ Posted via SMS</p>
      </div>
    </div>
  );
};