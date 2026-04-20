import { useState } from 'react';
import { useParams, Link } from 'react-router';
import CommentList from '../../components/CommentList/CommentList';
import CommentForm from '../../components/CommentForm/CommentForm';
import styles from './CommentPage.module.css';

export default function CommentPage() {
  const { postId } = useParams();
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className={styles.page_container}>
      <header className={styles.header}>
        <Link to="/" className={styles.back_link}>← Back to Overview</Link>
        <h1>Comment Moderation</h1>
      </header>

      <section className={styles.new_comment_section}>
        <h3>Add a Reply</h3>
        <CommentForm 
          postId={postId} 
          onSuccess={() => setRefreshKey(prev => prev + 1)} 
        />
      </section>

      <main>
        <CommentList key={refreshKey} />
      </main>
    </div>
  );
}
