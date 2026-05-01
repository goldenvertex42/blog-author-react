import { createContext, useState, useContext } from 'react';

export const AuthContext = createContext();

export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('blog_author_token'));
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem('blog_author_token');
    if (savedToken) {
      const decoded = decodeToken(savedToken);
      const currentTime = Date.now() / 1000;
      if (decoded && decoded.exp > currentTime) return decoded;
      localStorage.removeItem('blog_author_token');
    }
    return null;
  });

  const login = (newToken) => {
    localStorage.setItem('blog_author_token', newToken);
    setToken(newToken);
    setUser(decodeToken(newToken));
  };

  const logout = () => {
    localStorage.removeItem('blog_author_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
