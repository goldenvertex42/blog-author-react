import { http, HttpResponse } from 'msw';

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
];