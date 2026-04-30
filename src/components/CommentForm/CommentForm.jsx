import { useEffect, useRef } from 'react';
import { useFetcher } from 'react-router';
import Button from '../Button/Button';
import styles from './CommentForm.module.css';

export default function CommentForm({ postId, initialData = null, onSuccess, onCancel }) {
  const fetcher = useFetcher();
  const formRef = useRef();
  const isEditing = !!initialData;

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success) {
      if (onSuccess) onSuccess(); 
      if (!isEditing) formRef.current?.reset();
    }
  }, [fetcher.state, fetcher.data, isEditing, onSuccess]);

  return (
    <fetcher.Form 
      method="post" 
      className={styles.form} 
      ref={formRef}
      action={`/posts/${postId}/comments`} 
    >
      <input type="hidden" name="intent" value={isEditing ? "edit" : "create"} />
      {isEditing && <input type="hidden" name="commentId" value={initialData.id} />}
      
      <textarea 
        name="text"
        className={styles.textarea} 
        placeholder="Write a comment..." 
        defaultValue={initialData?.text || ''} 
        required 
      />

      <div className={styles.actions}>
        <Button 
          type="submit" 
          disabled={fetcher.state !== "idle"}
        >
          {fetcher.state !== "idle" 
            ? 'Saving...' 
            : (isEditing ? 'Update Comment' : 'Post Comment')
          }
        </Button>

        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>

      {fetcher.data?.errors?.serverError && (
        <p className={styles.error}>{fetcher.data.errors.serverError}</p>
      )}
    </fetcher.Form>
  );
}
