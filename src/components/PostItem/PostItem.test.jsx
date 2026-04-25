import { screen, render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import * as router from 'react-router';
import PostItem from './PostItem';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useFetcher: vi.fn(),
    Link: ({ children, to }) => <a href={to}>{children}</a>,
  };
});

describe('PostItem Unit Tests', () => {
  const mockPost = {
    id: 1,
    title: 'Test Post',
    published: false,
    _count: { comments: 5 }
  };

  it('renders post details correctly', () => {
    vi.mocked(router.useFetcher).mockReturnValue({
      formData: null,
      Form: ({ children, ...props }) => <form {...props}>{children}</form>,
    });

    render(<PostItem post={mockPost} />);

    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(screen.getByText('Comments (5)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /publish/i })).toBeInTheDocument();
  });

  it('shows "Published" badge and "Unpublish" button when post is published', () => {
    vi.mocked(router.useFetcher).mockReturnValue({
      formData: null,
      Form: ({ children }) => <form>{children}</form>,
    });

    render(<PostItem post={{ ...mockPost, published: true }} />);

    expect(screen.getByText('Published')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /unpublish/i })).toBeInTheDocument();
  });

  it('optimistically hides the component when the delete intent is sent', () => {
    const mockFormData = new FormData();
    mockFormData.append('intent', 'delete');
    mockFormData.append('postId', '1');

    vi.mocked(router.useFetcher).mockReturnValue({
      formData: mockFormData,
      Form: ({ children }) => <form>{children}</form>,
    });

    const { queryByTestId } = render(<PostItem post={mockPost} />);

    expect(queryByTestId('post-item')).not.toBeInTheDocument();
  });

  it('does NOT hide the component if a different post is being deleted', () => {
    const mockFormData = new FormData();
    mockFormData.append('intent', 'delete');
    mockFormData.append('postId', '99');

    vi.mocked(router.useFetcher).mockReturnValue({
      formData: mockFormData,
      Form: ({ children }) => <form>{children}</form>,
    });

    render(<PostItem post={mockPost} />);

    expect(screen.getByText('Test Post')).toBeInTheDocument();
  });
});
