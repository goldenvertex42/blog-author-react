import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import PostItem from '../PostItem/PostItem';
import styles from './PostList.module.css';

export default function PostList() {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:3000/posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [token]);

  const handleTogglePublish = async (id) => {
    try {
      const postToUpdate = posts.find(p => p.id === id);
      if (!postToUpdate) return;
      const response = await fetch(`http://localhost:3000/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ published: !postToUpdate.published })
      });
      if (!response.ok) throw new Error('Update failed');
      
      // Update local state immediately for a fast UI feel
      setPosts(posts.map(p => p.id === id ? { ...p, published: !p.published } : p));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const response = await fetch(`http://localhost:3000/posts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Delete failed');
      setPosts(posts.filter(p => p.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className={styles.loading}>Loading posts...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.post_list}>
      {posts.length === 0 ? (
        <div className={styles.empty_state}>
          <p>No posts found. Create your first one!</p>
        </div>
      ) : (
        posts.map(post => (
          <PostItem 
            key={post.id} 
            post={post} 
            onTogglePublish={handleTogglePublish}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}
