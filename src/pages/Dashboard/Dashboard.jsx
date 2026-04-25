import PostList from '../../components/PostList/PostList';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  return (
    <div className={styles.dashboard_container}>
      <header className={styles.header}>
        <h1>Post Overview</h1>
      </header>
      <main className={styles.main_content}>
        <h3 className={styles.section_title}>Your Posts</h3>
        <PostList />
      </main>
    </div>
  );
}


