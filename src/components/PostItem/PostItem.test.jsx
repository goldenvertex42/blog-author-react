import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import PostItem from './PostItem';

describe('PostItem', () => {
  const mockPost = {
    id: 1,
    title: 'Testing React Components',
    published: false,
  };

  const setup = (post = mockPost) => {
    const onTogglePublish = vi.fn();
    const onDelete = vi.fn();
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <PostItem 
          post={post} 
          onTogglePublish={onTogglePublish} 
          onDelete={onDelete} 
        />
      </MemoryRouter>
    );

    return { onTogglePublish, onDelete, user };
  };

  it('renders post title and correct initial status', () => {
    setup();
    expect(screen.getByText('Testing React Components')).toBeInTheDocument();
    expect(screen.getByText('Draft')).toBeInTheDocument();
  });
  
  it('applies "published" class and text when post is published', () => {
    setup({ ...mockPost, published: true });
    
    const statusLabel = screen.getByText('Published');
    expect(statusLabel).toBeInTheDocument();
    // Testing implementation details like classes is okay for status indicators
    expect(statusLabel).toHaveClass('published');
  });

  it('calls onTogglePublish when the toggle button is clicked', async () => {
    const { onTogglePublish, user } = setup();
    
    const toggleBtn = screen.getByRole('button', { name: /publish/i });
    await user.click(toggleBtn);
    
    expect(onTogglePublish).toHaveBeenCalledWith(mockPost.id);
  });

  it('calls onDelete when the delete button is clicked', async () => {
    const { onDelete, user } = setup();
    
    const deleteBtn = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteBtn);
    
    expect(onDelete).toHaveBeenCalledWith(mockPost.id);
  });

  it('changes button text based on published status', () => {
    const { rerender } = render(
      <MemoryRouter>
        <PostItem post={mockPost} onTogglePublish={() => {}} onDelete={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /publish/i })).toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <PostItem post={{ ...mockPost, published: true }} onTogglePublish={() => {}} onDelete={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /unpublish/i })).toBeInTheDocument();
  });
});
