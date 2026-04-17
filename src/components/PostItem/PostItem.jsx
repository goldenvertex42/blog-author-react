import styles from './PostItem.module.css';

/**
 * PostItem Component
 * @param {Object} post - The post object containing id, title, and published status
 * @param {Function} onTogglePublish - Callback to handle publishing/unpublishing
 * @param {Function} onDelete - Callback to handle post deletion
 */
export default function PostItem({ post, onTogglePublish, onDelete }) {
  return (
    <div className={styles.post_item} data-testid="post-item">
      <div className={styles.post_content}>
        <h3 className={styles.post_title}>{post.title}</h3>
        <span 
          className={`${styles.status_badge} ${post.published ? styles.published : styles.draft}`}
        >
          {post.published ? 'Published' : 'Draft'}
        </span>
      </div>
      
      <div className={styles.post_actions}>
        <button 
          className={styles.action_btn} 
          onClick={() => onTogglePublish(post.id)}
        >
          {post.published ? 'Unpublish' : 'Publish'}
        </button>
        
        <button className={styles.action_btn}>Edit</button>
        <button className={styles.action_btn}>Comments</button>
        
        <button 
          className={`${styles.action_btn} ${styles.delete_btn}`} 
          onClick={() => onDelete(post.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
