import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../Button/Button';
import CommentForm from '../CommentForm/CommentForm';
import styles from './CommentItem.module.css';

export default function CommentItem({ comment, onDelete, onRefresh }) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const isOwnComment = String(user?.id) === String(comment.userId);
  console.log("User ID:", user?.id, "Comment Author ID:", comment.userId)

  if (isEditing) {
    return (
      <div className={styles.comment_item}>
        <CommentForm 
          initialData={comment} 
          onSuccess={() => {
            setIsEditing(false);
            onRefresh();
          }} 
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
          <Button 
            onClick={() => setIsEditing(true)} 
            className={styles.edit_btn}
          >
            Edit
          </Button>
        )}
        
        <Button 
          variant="secondary" 
          onClick={() => onDelete(comment.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
