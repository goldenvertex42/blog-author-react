import { Link, useLoaderData, useParams, useRouteLoaderData } from 'react-router';
import CommentList from '../../components/CommentList/CommentList';
import CommentForm from '../../components/CommentForm/CommentForm';
import styles from './CommentPage.module.css';

export async function commentLoader({ params }) {
  const token = localStorage.getItem('blog_author_token');
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const res = await fetch(`${baseUrl}/posts/${params.postId}/comments`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export async function commentAction({ request, params }) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const token = localStorage.getItem('blog_author_token');
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const headers = { 
    'Content-Type': 'application/json', 
    'Authorization': `Bearer ${token}` 
  };

  if (intent === "delete") {
    const commentId = formData.get("commentId");
    await fetch(`${baseUrl}/posts/comments/${commentId}`, { method: 'DELETE', headers });
    return { success: true };
  }

  if (intent === "create" || intent === "update") {
    const text = formData.get("text");
    const commentId = formData.get("commentId");
    const method = intent === "update" ? "PUT" : "POST";
    const url = intent === "update" 
      ? `${baseUrl}/posts/comments/${commentId}` 
      : `${baseUrl}/posts/${params.postId}/comments`;

    const res = await fetch(url, { method, headers, body: JSON.stringify({ text }) });
    
    if (!res.ok) {
      const errorData = await res.json();
      return { serverError: errorData.message || "Submission failed" };
    }
    return { success: true };
  }
  return null;
}

export default function CommentPage() {
  const { postId } = useParams();
  const comments = useLoaderData();
  const { user } = useRouteLoaderData('root');

  return (
    <div className={styles.page_container}>
      <header className={styles.header}>
        <Link to="/" className={styles.back_link}>← Back to Overview</Link>
        <h1>Comment Moderation</h1>
      </header>

      <section className={styles.new_comment_section}>
        <h3>Add a Reply</h3>
        <CommentForm postId={postId} />
      </section>

      <main>
        <CommentList 
          comments={comments} 
          currentUser={user} 
          postId={postId}
          isModerator={true} 
        />
      </main>
    </div>
  );
}
