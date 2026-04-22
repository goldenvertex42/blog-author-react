import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import PostForm from '../../components/PostForm/PostForm';
import styles from './PostEditor.module.css';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function PostEditor() {
  const { postId } = useParams();
  const { token } = useAuth();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  if (postId) {
      setLoading(true);
      fetch(`${API_URL}/posts/${postId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setInitialData(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setInitialData(null);
      setLoading(false);
    }
  }, [postId, token]);


  if (loading) return <div className="loading">Loading post editor...</div>;

  return (
    <div className={styles.editor_page}>
      <header className={styles.editor_header}>
        <h1>{postId ? 'Edit Post' : 'Create New Post'}</h1>
      </header>
      
      <main className={styles.editor_container}>
        <PostForm 
          key={initialData?.id || 'new'} 
          initialData={initialData || { title: '', content: '', published: false }} 
        />
        
      </main>
    </div>
  );
}
