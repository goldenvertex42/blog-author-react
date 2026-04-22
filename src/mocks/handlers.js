import { http, HttpResponse } from 'msw';

let mockPosts = [
  { id: 1, title: "First Post", published: true },
  { id: 2, title: "Second Post", published: false },
];

let mockComments = [
  { id: 1, postId: 1, text: "Great post!", user: { username: "janedoe" }, userId: 2, createdAt: new Date().toISOString() },
  { id: 2, postId: 1, text: "Very helpful, thanks!", user: { username: "johnsmith" }, userId: 3, createdAt: new Date().toISOString() },
  { id: 3, postId: 2, text: "First comment here!", user: { username: "alice" }, userId: 4, createdAt: new Date().toISOString() },
];

export const handlers = [
  http.post('http://localhost:3000/auth/register', async ({ request }) => {
    const newUser = await request.json();
    if (newUser.adminCode !== 'super-secret-blog-code') {
      return HttpResponse.json({ error: "Invalid admin code" }, { status: 400 });
    }

    return HttpResponse.json({
      message: "User created successfully!",
      user: { id: 1, username: newUser.username, isAuthor: true }
    }, { status: 201 });
  }),

  http.post('*/login', async () => {
    return HttpResponse.json({
      token: "header.eyJ1c2VybmFtZSI6InRlc3R1c2VyIn0.signature"
    }, { status: 200 })
  }),

  http.get('http://localhost:3000/posts/admin', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return new HttpResponse(null, { status: 401 });

    return HttpResponse.json(mockPosts);
  }),

  http.post('http://localhost:3000/posts', async ({ request }) => {
    return HttpResponse.json({ message: "Post created" }, { status: 201 });
  }),

  http.put('http://localhost:3000/posts/:id', async ({ request, params }) => {
    const { id } = params;
    const body = await request.json();
    
    mockPosts = mockPosts.map(p => 
      p.id === Number(id) ? { ...p, published: body.published } : p
    );

    return HttpResponse.json({ message: "Updated successfully" });
  }),

  http.delete('http://localhost:3000/posts/:id', ({ params }) => {
    const { id } = params;
    mockPosts = mockPosts.filter(p => p.id !== Number(id));
    return new HttpResponse(null, { status: 204 });
  }),

  http.get('http://localhost:3000/posts/:postId/comments', ({ params }) => {
    const { postId } = params;
    const filteredComments = mockComments.filter(c => c.postId === Number(postId));
    return HttpResponse.json(filteredComments);
  }),

  http.post('http://localhost:3000/posts/:postId/comments', async ({ request, params }) => {
    const { postId } = params;
    const body = await request.json();
    
    const newComment = {
      id: mockComments.length + 1,
      postId: Number(postId),
      text: body.content,
      user: { username: "testuser" },
      userId: 1,          
      createdAt: new Date().toISOString(),
    };
    
    mockComments.push(newComment);
    return HttpResponse.json(newComment, { status: 201 });
  }),

  http.delete('http://localhost:3000/comments/:id', ({ params }) => {
    const { id } = params;
    mockComments = mockComments.filter(c => c.id !== Number(id));
    return new HttpResponse(null, { status: 204 });
  }),
];