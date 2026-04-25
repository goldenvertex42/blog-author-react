import { screen, render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import * as router from 'react-router';
import PostForm from './PostForm';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useNavigation: vi.fn(),
    useActionData: vi.fn(),
    Form: ({ children, ...props }) => <form {...props}>{children}</form>,
  };
});

describe('PostForm Unit Tests', () => {
  it('displays the error banner when actionData.error exists', () => {
    vi.mocked(router.useActionData).mockReturnValue({ serverError: 'Validation failed' });
    vi.mocked(router.useNavigation).mockReturnValue({ state: 'idle' });

    render(<PostForm initialData={{}} />);
    
    expect(screen.getByText('Validation failed')).toBeInTheDocument();
  });

  it('shows "Saving..." and disables buttons when state is "submitting"', () => {
    vi.mocked(router.useActionData).mockReturnValue(null);
    vi.mocked(router.useNavigation).mockReturnValue({ state: 'submitting' });

    render(<PostForm initialData={{}} />);
    
    const submitBtn = screen.getByRole('button', { name: /saving\.\.\./i });
    expect(submitBtn).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
  });

  it('populates fields with initialData', () => {
    vi.mocked(router.useActionData).mockReturnValue(null);
    vi.mocked(router.useNavigation).mockReturnValue({ state: 'idle' });

    const data = { title: 'Hello', text: 'World', id: '123' };
    render(<PostForm initialData={data} />);

    expect(screen.getByDisplayValue('Hello')).toBeInTheDocument();
    expect(screen.getByDisplayValue('World')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update post/i })).toBeInTheDocument();
  });
});
