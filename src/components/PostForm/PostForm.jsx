import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import Input from '../Input/Input';
import Button from '../Button/Button';
import styles from './PostForm.module.css';

export default function PostForm({ onSave, initialData = {} }) {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    content: initialData.content || '',
    published: initialData.published || false,
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = initialData.id 
        ? `http://localhost:3000/posts/${initialData.id}` 
        : 'http://localhost:3000/posts';
      
      const response = await fetch(url, {
        method: initialData.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to save post');
      }
      
      if (onSave) onSave();
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className={styles.post_form} onSubmit={handleSubmit}>
      <Input
        id="title"
        label="Title"
        name="title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />
      
      <div className={styles.textarea_group}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          required
        />
      </div>

      <div className={styles.checkbox_group}>
        <input
          type="checkbox"
          id="published"
          checked={formData.published}
          onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
        />
        <label htmlFor="published">Publish immediately</label>
      </div>

      {error && <p className="error-banner">{error}</p>}
      <Button type="submit">{initialData.id ? 'Update Post' : 'Create Post'}</Button>
      <Button type="button" onClick={() => navigate('/')} className={styles.cancel_btn}>Cancel</Button>
    </form>
  );
}
