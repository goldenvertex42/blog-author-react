import { useFetchers } from 'react-router';
import CommentItem from '../CommentItem/CommentItem';
import styles from './CommentList.module.css';

export default function CommentList({ comments, currentUser, isModerator }) {
  const fetchers = useFetchers();

  const addFetcher = fetchers.find(f => f.formData?.get("intent") === "create");
  const isAdding = !!addFetcher;

  const optimisticComment = isAdding ? {
    id: "temp-opt-id",
    text: addFetcher.formData.get("text"),
    user: { username: currentUser?.username || 'You' },
    createdAt: new Date().toISOString(),
    isOptimistic: true
  } : null;

  const displayComments = optimisticComment 
    ? [optimisticComment, ...comments] 
    : comments;

  return (
    <div className={styles.comment_list}>
      {displayComments.length === 0 && !isAdding ? (
        <div className={styles.empty_state}>
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        displayComments.map(comment => (
          <CommentItem 
            key={comment.id} 
            comment={comment} 
            currentUser={currentUser} 
            isModerator={isModerator} 
          />
        ))
      )}
    </div>
  );
}
