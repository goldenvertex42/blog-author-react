import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';

const TestConsumer = () => {
  const { user, token, login, logout } = useAuth();
  return (
    <div>
      <div data-testid="username">{user?.username || 'no-user'}</div>
      <div data-testid="token">{token || 'no-token'}</div>
      <button onClick={() => login('header.eyJ1c2VybmFtZSI6InRlc3R1c2VyIiwiZXhwIjoyNTI0NjA4MDAwfQ.sig')}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext Unit Tests', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it('initializes with null state when localStorage is empty', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('username')).toHaveTextContent('no-user');
    expect(screen.getByTestId('token')).toHaveTextContent('no-token');
  });

  it('lazily initializes from localStorage if a valid token exists', () => {
    // Mock a valid token (exp is in the far future)
    const validToken = 'header.eyJ1c2VybmFtZSI6InNhdmVkdXNlciIsImV4cCI6MjUyNDYwODAwMH0.sig';
    window.localStorage.setItem('token', validToken);

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('username')).toHaveTextContent('saveduser');
    expect(screen.getByTestId('token')).toHaveTextContent(validToken);
  });

  it('clears localStorage and initializes as null if token is expired', () => {
    // Mock an expired token (exp is 0)
    const expiredToken = 'header.eyJ1c2VybmFtZSI6ImV4cGlyZWQiLCJleHAiOjB9.sig';
    window.localStorage.setItem('token', expiredToken);

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('username')).toHaveTextContent('no-user');
    expect(window.localStorage.getItem('token')).toBeNull();
  });

  it('updates state and localStorage on login', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    const loginBtn = screen.getByText('Login');
    act(() => {
      loginBtn.click();
    });

    expect(screen.getByTestId('username')).toHaveTextContent('testuser');
    expect(window.localStorage.getItem('token')).toBeTruthy();
  });

  it('clears state and localStorage on logout', () => {
    window.localStorage.setItem('token', 'some-token');

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    const logoutBtn = screen.getByText('Logout');
    act(() => {
      logoutBtn.click();
    });

    expect(screen.getByTestId('username')).toHaveTextContent('no-user');
    expect(window.localStorage.getItem('token')).toBeNull();
  });
});
