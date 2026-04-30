import { screen } from '@testing-library/react';
import Sidebar from './Sidebar';
import { renderWithRouter } from '../../../tests/test-utils';

describe('Sidebar Component', () => {
  it('renders the username from the root loader data', async () => {
    const mockUser = { username: 'AuthorAlpha' };

    renderWithRouter(<Sidebar />, {
      id: 'root',
      loaderData: { user: { username: 'AuthorAlpha' } }
    });

    const welcomeMessage = await screen.findByText(/AuthorAlpha/i);
    expect(welcomeMessage).toBeInTheDocument();
  });

  it('contains links to Posts and New Post creation', async () => {
    renderWithRouter(<Sidebar />, {
      loader: () => ({ user: { username: 'Editor' } })
    });

    expect(await screen.findByText(/Posts Overview/i)).toBeInTheDocument();
    expect(screen.getByText(/New Post/i)).toBeInTheDocument();
  });
});
