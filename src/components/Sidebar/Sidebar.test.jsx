import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import { describe, it, expect, vi } from 'vitest';

const renderSidebar = (authValue) => {
  return render(
    <AuthContext.Provider value={authValue}>
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

describe('Sidebar Component', () => {
  const mockLogout = vi.fn();
  const authValue = {
    logout: mockLogout,
    user: { name: 'Author' }
  };

  it('renders all navigation links', () => {
    renderSidebar(authValue);
    
    expect(screen.getByText(/new post/i)).toBeInTheDocument();
    expect(screen.getByText(/posts overview/i)).toBeInTheDocument();
    expect(screen.getByText(/public blog view/i)).toBeInTheDocument();
  });

  it('Public Blog View link opens in a new tab', () => {
    renderSidebar(authValue);
    const publicLink = screen.getByText(/public blog view/i).closest('a');
    
    expect(publicLink).toHaveAttribute('target', '_blank');
    expect(publicLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('calls logout function when logout button is clicked', () => {
    renderSidebar(authValue);
    
    const logoutBtn = screen.getByText(/logout/i);
    fireEvent.click(logoutBtn);
    
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
