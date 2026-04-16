import { http, HttpResponse } from 'msw';

export const handlers = [
  // Intercept POST requests to your register endpoint
  http.post('http://localhost:3000/auth/register', async ({ request }) => {
    const newUser = await request.json();

    // Mock a successful registration response
    return HttpResponse.json({
      message: "User created successfully!",
      user: { id: 1, username: newUser.username, isAuthor: false }
    }, { status: 201 });
  }),
];