import { useState } from 'react';
import { useFetcher, useParams } from 'react-router';
import Button from '../Button/Button';
import CommentForm from '../CommentForm/CommentForm';
import styles from './CommentItem.module.css';

export default function CommentItem({ comment, currentUser, isModerator }) {
  const { postId } = useParams();
  const fetcher = useFetcher();
  const [isEditing, setIsEditing] = useState(false);

  const isOwnComment = String(currentUser?.id) === String(comment.userId || comment.user?.id);
  const canModerate = isOwnComment || isModerator;


  const handleDelete = (event) => {
    if (!window.confirm("Are you sure you want to permanently delete this comment?")) {
      event.preventDefault();
    }
  };

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
          onCancel={() => setIsEditing(false)} 
        />
      </div>
    );
  }

  return (
    <div className={styles.comment_item}>
      <div className={styles.comment_meta}>
        <strong>{comment.user?.username || "Guest"}</strong>
        <span className={styles.date}>
          {new Date(comment.createdAt).toLocaleDateString()}
        </span>
      </div>

      <p className={styles.content}>{comment.text}</p>

      <div className={styles.actions}>
        {canModerate && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
