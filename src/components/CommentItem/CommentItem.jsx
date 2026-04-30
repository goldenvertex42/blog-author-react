import { useState } from 'react';
import { useFetcher, useParams } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import Button from '../Button/Button';
import CommentForm from '../CommentForm/CommentForm';
import styles from './CommentItem.module.css';

export default function CommentItem({ comment }) {
  const { user } = useAuth();
  const { postId } = useParams();
  const fetcher = useFetcher();
  const [isEditing, setIsEditing] = useState(false);
  
  const handleDelete = (event) => {
    if (!window.confirm("Are you sure you want to permanently delete this comment?")) {
      event.preventDefault();
    }
  };

  const isOwnComment = String(user?.id) === String(comment.userId);

  const isDeleting = 
    fetcher.state !== "idle" && 
    fetcher.formData?.get("commentId") === String(comment.id) &&
    fetcher.formData?.get("intent") === "delete";

  if (isDeleting) return null;

  if (isEditing) {
    return (
      <div className={styles.comment_item}>
        <CommentForm 
          postId={postId}
          initialData={comment} 
          onSuccess={() => setIsEditing(false)}
          onCancel={() => setIsEditing(false)} 
        />
      </div>
    );
  }

  return (
    <div className={styles.comment_item}>
      <div className={styles.comment_meta}>
        <strong>{comment.user.username}</strong>
        <span className={styles.date}>
          {new Date(comment.createdAt).toLocaleDateString()}
        </span>
      </div>
      
      <p className={styles.content}>{comment.text}</p>
      
      <div className={styles.actions}>
        {isOwnComment && (
          <Button onClick={() => setIsEditing(true)} className={styles.edit_btn}>
            Edit
          </Button>
        )}

        <fetcher.Form method="post" onSubmit={handleDelete}>
          <input type="hidden" name="commentId" value={comment.id} />
          <input type="hidden" name="intent" value="delete" />
          <Button 
            type="submit" 
            variant="secondary"
            disabled={fetcher.state !== "idle"}
          >
            {fetcher.state !== "idle" ? "Deleting..." : "Delete"}
          </Button>
        </fetcher.Form>
      </div>
    </div>
  );
}
