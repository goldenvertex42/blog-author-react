// src/components/CommentList/CommentList.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import CommentItem from '../CommentItem/CommentItem';
import styles from './CommentList.module.css';

export default function CommentList() {
  const { postId } = useParams();
  const { token } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:3000/posts/${postId}/comments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId, token]);

  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    
    try {
      const response = await fetch(`http://localhost:3000/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Delete failed');
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className={styles.loading}>Loading comments...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.comment_list}>
      <h2 className={styles.title}>Manage Comments ({comments.length})</h2>
      
      {comments.length === 0 ? (
        <div className={styles.empty_state}>
          <p>No comments yet for this post.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {comments.map(comment => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              onDelete={handleDelete}
              onRefresh={fetchComments}
            />
          ))}
        </div>
      )}
    </div>
  );
}
