import { screen, render } from '@testing-library/react';
import { createRoutesStub } from 'react-router';
import CommentList from './CommentList';

describe('CommentList Component', () => {
  const mockComments = [
    { 
      id: 1, 
      text: "Existing Comment", 
      user: { username: "UserOne" }, 
      createdAt: new Date().toISOString() 
    }
  ];
  const currentUser = { username: "AuthorMe", id: "auth-123" };

  it('optimistically displays a new comment when adding', async () => {
    const Stub = createRoutesStub([
      {
        id: 'root',
        path: '/',
        Component: () => <CommentList comments={mockComments} currentUser={currentUser} />
      }
    ]);

    render(
      <Stub 
        initialEntries={['/']} 
        hydrationData={{
          loaderData: { 'root': { user: currentUser } }
        }}
      />
    );

    expect(await screen.findByText("Existing Comment")).toBeInTheDocument();
  });

  it('optimistically hides a comment when it is being deleted', async () => {
    const Stub = createRoutesStub([
      {
        id: 'root',
        path: '/',
        Component: () => <CommentList comments={mockComments} currentUser={currentUser} />
      }
    ]);

    render(
      <Stub 
        initialEntries={['/']}
        hydrationData={{
          loaderData: { 'root': { user: currentUser } }
        }}
      />
    );

    expect(await screen.findByText("Existing Comment")).toBeInTheDocument();
  });
});

