import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../Button/Button';
import styles from './CommentForm.module.css';

export default function CommentForm({ postId, initialData = null, onSuccess, onCancel }) {
  const { token } = useAuth();
  const [content, setContent] = useState(initialData?.content || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = initialData 
        ? `http://localhost:3000/comments/${initialData.id}` 
        : `http://localhost:3000/posts/${postId}/comments`;
      
      const response = await fetch(url, {
        method: initialData ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        onSuccess();
        if (!initialData) setContent('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <textarea
        className={styles.textarea}
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <div className={styles.actions}>
        <Button type="submit" disabled={isSubmitting}>
          {initialData ? 'Update Comment' : 'Post Comment'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
