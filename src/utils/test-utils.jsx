import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { AuthContext } from '../context/AuthContext';

export function renderWithRouter(ui, { route = '/', path = '/', loaderData = null, userValue = null } = {}) {
  const routes = [
    {
      path: path,
      element: (
        <AuthContext.Provider value={userValue}>
          {ui}
        </AuthContext.Provider>
      ),
      loader: loaderData ? () => loaderData : undefined,
    },
  ];

  const router = createMemoryRouter(routes, {
    initialEntries: [route],
  });

  return render(<RouterProvider router={router} />);
}
