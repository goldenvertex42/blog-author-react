import React from 'react';
import { NavLink } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h1 className={styles.title}>Author Portal</h1>
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
          href="https://your-reader-frontend.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.navItem}
        >
          Public Blog View
          <span className={styles.externalIcon}>↗</span>
        </a>
      </nav>

      <div className={styles.footer}>
        <button onClick={logout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
