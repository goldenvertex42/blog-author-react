import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';
import { AuthProvider } from './context/AuthContext';

const renderWithAuth = (ui) => render(<AuthProvider>{ui}</AuthProvider>);

describe('App Integration', () => {
  it('toggles between Register and Login views', async () => {
    renderWithAuth(<App />);
    
    const toggleBtn = await screen.findByText(/login/i);
    expect(screen.getByText(/create author account/i)).toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });

  it('shows dashboard when a user is logged in', async () => {
    const mockToken = "header.eyJ1c2VybmFtZSI6InRlc3R1c2VyIn0.signature";
    window.localStorage.setItem('token', mockToken);

    renderWithAuth(<App />);

    const dashboard = await screen.findByTestId('dashboard');
    expect(dashboard).toBeInTheDocument();
    expect(screen.getByText(/testuser/i)).toBeInTheDocument();
  });

  it('displays the correct heading when toggling views', async () => {
    renderWithAuth(<App />);
    
    expect(screen.getByRole('heading', { name: /create author account/i, level: 1 })).toBeInTheDocument();

    const toggleBtn = screen.getByText(/login/i);
    fireEvent.click(toggleBtn);

    expect(screen.getByRole('heading', { name: /welcome back/i, level: 1 })).toBeInTheDocument();
  });
});