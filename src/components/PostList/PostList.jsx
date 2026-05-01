import { useLoaderData, Link } from 'react-router';
import PostItem from '../PostItem/PostItem';
import styles from './PostList.module.css';

export async function postLoader() {
  const token = localStorage.getItem('blog_author_token');
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/admin`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!response.ok) throw new Response("Failed to load posts", { status: response.status });
  return response.json();
}

export async function postListAction({ request }) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const postId = formData.get("postId");
  const token = localStorage.getItem('blog_author_token');
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  if (intent === "delete") {
    if (!window.confirm("Are you sure you want to delete this post?")) return null;
    
    await fetch(`${baseUrl}/posts/${postId}`, {
      method: "DELETE",
      headers: { 'Authorization': `Bearer ${token}` },
    });
  }

  if (intent === "toggle-publish") {
    const currentStatus = formData.get("published") === "true";
    await fetch(`${baseUrl}/posts/${postId}`, {
      method: "PATCH",
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ published: !currentStatus }),
    });
  }

  return { success: true };
}


export default function PostList() {
  const posts = useLoaderData();

  return (
    <div className={styles.post_list_container}>
      {posts.length === 0 ? (
        <p className={styles.empty_state}>You haven't written any posts yet.</p>
      ) : (
        <div className={styles.post_grid}>
          {posts.map((post) => (
            <PostItem 
              key={post.id} 
              post={post} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
