import { Outlet } from 'react-router';
import Sidebar from '../Sidebar/Sidebar';
import styles from './AuthorLayout.module.css';

const AuthorLayout = () => {
  return (
    <div className={styles.layoutContainer}>
      <Sidebar />
      <main className={styles.mainContent}>
        <Outlet /> 
      </main>
    </div>
  );
};

export default AuthorLayout;
