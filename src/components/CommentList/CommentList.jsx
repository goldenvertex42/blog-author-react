import CommentItem from '../CommentItem/CommentItem';
import styles from './CommentList.module.css';

export default function CommentList({ comments }) {
  return (
    <div className={styles.comment_list}>
      <h2 className={styles.title}>
        Manage Comments ({comments.length})
      </h2>

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
            />
          ))}
        </div>
      )}
    </div>
  );
}
