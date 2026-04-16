import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';

const MOCK_TOKEN = "header.eyJ1c2VybmFtZSI6InRlc3R1c2VyIn0.signature";

const TestConsumer = () => {
  const { user, loading } = useAuth();
  if (loading) return <div data-testid="loading">Loading...</div>;
  return <div data-testid="user">{user ? user.username : 'Guest'}</div>;
};

describe('AuthContext with Loading State', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('resolves to Guest after initialization', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    const userElement = await screen.findByTestId('user');
    expect(userElement.textContent).toBe('Guest');
  });

  it('restores user from localStorage after loading', async () => {
    window.localStorage.setItem('token', MOCK_TOKEN);

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    const userElement = await screen.findByTestId('user');
    expect(userElement.textContent).toBe('testuser');
  });
});
