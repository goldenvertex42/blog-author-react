import { useEffect } from 'react';
import { useFetcher } from 'react-router';
import Button from '../Button/Button';
import styles from './CommentForm.module.css';

export default function CommentForm({ postId, initialData = null, onCancel }) {
  const fetcher = useFetcher();
  
  const isEditing = !!initialData;
  const isSubmitting = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success) {
      if (isEditing && onCancel) {
        onCancel();
      }
    }
  }, [fetcher.state, fetcher.data, isEditing, onCancel]);

  return (
    <fetcher.Form 
      method="post" 
      className={styles.form}
      key={isSubmitting ? "submitting" : "idle"}
    >
      <input type="hidden" name="intent" value={isEditing ? "update" : "create"} />
      {isEditing && <input type="hidden" name="commentId" value={initialData.id} />}

      <textarea 
        name="text" 
        className={styles.textarea} 
        placeholder="Share your thoughts..." 
        defaultValue={initialData?.text || ''} 
        required 
        disabled={isSubmitting}
        autoFocus={isEditing}
      />

      <div className={styles.actions}>
        {isEditing && (
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting 
            ? 'Saving...' 
            : (isEditing ? 'Update Comment' : 'Post Comment')
          }
        </Button>
      </div>

      {fetcher.data?.serverError && (
        <p className={styles.error}>{fetcher.data.serverError}</p>
      )}
    </fetcher.Form>
  );
}

