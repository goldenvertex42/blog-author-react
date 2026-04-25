import { Link, useFetcher } from 'react-router';
import styles from './PostItem.module.css';

export default function PostItem({ post }) {
  const fetcher = useFetcher();
  
  const isDeleting = fetcher.formData?.get("intent") === "delete" && 
                     fetcher.formData?.get("postId") === String(post.id);

  if (isDeleting) return null;

  return (
    <div className={styles.post_item} data-testid="post-item">
      <div className={styles.post_content}>
        <h3 className={styles.post_title}>{post.title}</h3>
        <span className={`${styles.status_badge} ${post.published ? styles.published : styles.draft}`}>
          {post.published ? 'Published' : 'Draft'}
        </span>
      </div>

      <div className={styles.post_actions}>
        <fetcher.Form method="post" style={{ display: 'inline' }}>
          <input type="hidden" name="postId" value={post.id} />
          <input type="hidden" name="published" value={String(post.published)} />
          <button 
            type="submit" 
            name="intent" 
            value="toggle-publish" 
            className={styles.action_btn}
          >
            {post.published ? 'Unpublish' : 'Publish'}
          </button>
        </fetcher.Form>

        <Link to={`/posts/${post.id}/edit`} className={styles.action_btn}>
          Edit
        </Link>
        
        <Link to={`/posts/${post.id}/comments`} className={styles.action_btn}>
          Comments ({post._count?.comments || 0})
        </Link>

        <fetcher.Form method="post" style={{ display: 'inline' }}>
          <input type="hidden" name="postId" value={post.id} />
          <button 
            type="submit" 
            name="intent" 
            value="delete" 
            className={`${styles.action_btn} ${styles.delete_btn}`}
          >
            Delete
          </button>
        </fetcher.Form>
      </div>
    </div>
  );
}
