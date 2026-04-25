import React from 'react';
import { NavLink, Form } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h1 className={styles.title}>Author Portal</h1>
        <div className={styles.welcome_section}>
          <h2>Welcome back, <span className={styles.username}>{user?.username}</span></h2>
        </div>
      </div>

      <nav className={styles.nav}>
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `${styles.navItem} ${isActive ? styles.active : ''}`
          }
        >
          Posts Overview
        </NavLink>

        <NavLink 
          to="posts/new" 
          className={({ isActive }) => 
            `${styles.navItem} ${isActive ? styles.active : ''}`
          }
        >
          New Post
        </NavLink>

        <a 
          href={import.meta.env.VITE_READER_APP_URL} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.navItem}
        >
          Public Blog View
          <span className={styles.externalIcon}>↗</span>
        </a>
      </nav>

      <Form 
        method="post" 
        action="/logout" 
        className={styles.footer}
        onSubmit={() => logout()} // Still clear the React state for immediate UI feedback
      >
        <button type="submit" className={styles.logoutButton}>Logout</button>
      </Form>
    </aside>
  );
};

export default Sidebar;
