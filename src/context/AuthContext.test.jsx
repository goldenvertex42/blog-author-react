import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext'; // DOUBLE CHECK THIS PATH
import { expect, it, describe, beforeEach } from 'vitest';

const createMockToken = (username = 'testuser', expired = false) => {
  // Use a standard JWT header
  const header = btoa(JSON.stringify({ alg: 'HS256' })).replace(/=/g, '');
  
  // Expiration logic
  const exp = expired 
    ? Math.floor(Date.now() / 1000) - 3600 
    : Math.floor(Date.now() / 1000) + 3600;
    
  // Strip padding from the payload too
  const payload = btoa(JSON.stringify({ username, exp })).replace(/=/g, '');
  
  return `${header}.${payload}.signature`;
};

const TestComponent = () => {
  const { user, token, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="username">{user?.username || 'no-user'}</span>
      <span data-testid="token">{token || 'no-token'}</span>
      <button onClick={() => login(createMockToken('newuser'))}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('Author AuthContext Unit Tests', () => {
  const TOKEN_KEY = 'blog_author_token';

  beforeEach(() => {
    localStorage.clear();
  });

  it('lazily initializes from localStorage if a valid token exists', () => {
    const validToken = createMockToken('saveduser');
    localStorage.setItem(TOKEN_KEY, validToken);
    
    render(<AuthProvider><TestComponent /></AuthProvider>);

    expect(screen.getByTestId('username')).toHaveTextContent('saveduser');
    expect(screen.getByTestId('token')).toHaveTextContent(validToken);
  });

  it('clears localStorage and initializes as null if token is expired', () => {
    const expiredToken = createMockToken('expired', true);
    localStorage.setItem(TOKEN_KEY, expiredToken);

    render(<AuthProvider><TestComponent /></AuthProvider>);

    expect(screen.getByTestId('username')).toHaveTextContent('no-user');
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  it('updates state and localStorage on login', () => {
    render(<AuthProvider><TestComponent /></AuthProvider>);

    act(() => {
      screen.getByText('Login').click();
    });

    expect(screen.getByTestId('username')).toHaveTextContent('newuser');
    expect(localStorage.getItem(TOKEN_KEY)).toBeDefined();
  });

  it('clears state and localStorage on logout', () => {
    localStorage.setItem(TOKEN_KEY, createMockToken());

    render(<AuthProvider><TestComponent /></AuthProvider>);

    act(() => {
      screen.getByText('Logout').click();
    });

    expect(screen.getByTestId('username')).toHaveTextContent('no-user');
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });
});
