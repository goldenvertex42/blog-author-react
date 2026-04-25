import { screen, render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Dashboard from './Dashboard';

vi.mock('../../components/PostList/PostList', () => ({
  default: () => <div data-testid="mock-post-list">Post List Component</div>
}));

describe('Dashboard Unit Test', () => {
  it('renders the dashboard layout with the correct headings', () => {
    render(<Dashboard />);

    expect(screen.getByRole('heading', { name: /post overview/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /your posts/i, level: 3 })).toBeInTheDocument();
  });

  it('renders the modular PostList component', () => {
    render(<Dashboard />);

    expect(screen.getByTestId('mock-post-list')).toBeInTheDocument();
    expect(screen.getByText('Post List Component')).toBeInTheDocument();
  });
});
