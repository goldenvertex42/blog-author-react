import { useState, useEffect } from 'react';
import { Outlet, useNavigation, useLocation } from 'react-router';
import Sidebar from '../Sidebar/Sidebar';
import styles from './AuthorLayout.module.css';

const AuthorLayout = () => {
  const navigation = useNavigation();

  const [shouldAnimate, setShouldAnimate] = useState(() => {
    return sessionStorage.getItem('justLoggedIn') === 'true';
  });

  useEffect(() => {
    if (shouldAnimate) {
      sessionStorage.removeItem('justLoggedIn');
      
      const timer = setTimeout(() => {
        setShouldAnimate(false);
      }, 600); 
      
      return () => clearTimeout(timer);
    }
  }, [shouldAnimate]);

  const isEntering = navigation.state === "idle" && shouldAnimate;

  const isExiting = 
    navigation.state === "submitting" && 
    navigation.formAction === "/logout";

  return (
    <div className={`
      ${styles.layoutContainer} 
      ${isEntering ? styles.fadeIn : styles.showImmediately}
      ${isExiting ? styles.fadeOut : ''}
    `}>
      <Sidebar />
      <main className={styles.mainContent}>
        <Outlet /> 
      </main>
    </div>
  );
};

export default AuthorLayout;
