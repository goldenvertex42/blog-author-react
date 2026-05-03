import React from 'react';
import { NavLink, Form, useRouteLoaderData, useNavigation } from 'react-router';
import styles from './Sidebar.module.css';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const rootData = useRouteLoaderData("root");
  const user = rootData?.user;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h1 className={styles.title}>Author Portal</h1>
        <div className={styles.welcome_section}>
          <h2>Welcome back, <span className={styles.username}>{user?.username}</span></h2>
        </div>
      </div>

      <nav className={styles.nav} onTouchStart="">
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
      >
        <button type="submit" className={styles.logoutButton}>Logout</button>
      </Form>
    </aside>
  );
};

export default Sidebar;
