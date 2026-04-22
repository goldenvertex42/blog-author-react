import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import * as authContext from '../../context/AuthContext'; // Import everything as an object
import Sidebar from './Sidebar';
import { describe, it, expect, vi } from 'vitest';

describe('Sidebar Component', () => {
  const mockLogout = vi.fn();

  vi.spyOn(authContext, 'useAuth').mockReturnValue({
    logout: mockLogout,
    user: { name: 'Author' }
  });

  const renderSidebar = () => {
    return render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );
  };

  it('renders all navigation links', () => {
    renderSidebar();
    
    expect(screen.getByText(/new post/i)).toBeInTheDocument();
    expect(screen.getByText(/posts overview/i)).toBeInTheDocument();
    expect(screen.getByText(/public blog view/i)).toBeInTheDocument();
  });

  it('Public Blog View link opens in a new tab', () => {
    renderSidebar();
    const publicLink = screen.getByRole('link', { name: /public blog view/i });
    
    expect(publicLink).toHaveAttribute('target', '_blank');
    expect(publicLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('calls logout function when logout button is clicked', () => {
    renderSidebar();
    
    const logoutBtn = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutBtn);
    
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
