import { useLoaderData, useParams, redirect } from 'react-router';
import PostForm from '../../components/PostForm/PostForm';
import styles from './PostEditor.module.css';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export async function postEditorLoader({ params }) {
  const { postId } = params;
  
  if (!postId) return null;

  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/posts/${postId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!response.ok) {
    if (response.status === 404) throw new Response("Post Not Found", { status: 404 });
    throw new Response("Failed to fetch post", { status: response.status });
  }

  return response.json();
}

export async function postEditorAction({ request, params }) {
  const { postId } = params;
  const formData = await request.formData();
  const updates = {
    title: formData.get("title"),
    text: formData.get("text"),
    published: formData.get("published") === "on",
  };

  const token = localStorage.getItem('token');
  const method = postId ? "PUT" : "POST";
  const url = postId ? `${API_URL}/posts/${postId}` : `${API_URL}/posts`;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (result.errors) {
        const errorObject = result.errors.reduce((acc, err) => {
          acc[err.path || err.param] = err.msg;
          return acc;
        }, {});
        return { errors: errorObject };
      }
      return { serverError: result.message || result.error || "Failed to save post" };
    }

    return redirect("/");
  } catch (err) {
    return { serverError: "Could not connect to the server" };
  }
}


export default function PostEditor() {
  const post = useLoaderData(); 
  const { postId } = useParams();
  const isEditMode = Boolean(postId);

  return (
    <div className={styles.editor_container}>
      <header className={styles.editor_header}>
        <h1>{isEditMode ? 'Edit Post' : 'Create New Post'}</h1>
      </header>
      
      <main className={styles.editor_main}>
        <PostForm 
        initialData={post || {}}
        key={post?.id || 'new'} 
        />
      </main>
    </div>
  );
}
