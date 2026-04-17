import { http, HttpResponse } from 'msw';

let mockPosts = [
  { id: 1, title: "First Post", published: true },
  { id: 2, title: "Second Post", published: false },
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

  http.get('http://localhost:3000/posts', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return new HttpResponse(null, { status: 401 });

    return HttpResponse.json(mockPosts);
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
];