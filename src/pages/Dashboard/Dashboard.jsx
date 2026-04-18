import { useAuth } from '../../context/AuthContext';
import PostList from '../../components/PostList/PostList';
import { Link } from 'react-router';
import styles from './Dashboard.module.css';
import Button from '../../components/Button/Button';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className={styles.dashboard_container}>
      <header className={styles.header}>
        <div className={styles.top_bar}>
          <h1>Author Dashboard</h1>
          <Button onClick={logout} variant="secondary">Logout</Button>
        </div>
        
        <div className={styles.welcome_section}>
          <h2>Welcome back, <span className={styles.username}>{user?.username}</span></h2>
          <Link to="/posts/new" className={styles.new_post_link}>
            + Create New Post
          </Link>
        </div>
      </header>

      <main className={styles.main_content}>
        <h3 className={styles.section_title}>Your Posts</h3>
        <PostList />
      </main>
    </div>
  );
}

