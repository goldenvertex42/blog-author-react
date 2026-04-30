import { render } from '@testing-library/react';
import { createRoutesStub } from 'react-router';
import { AuthContext } from '../src/context/AuthContext';

export function renderWithRouter(ui, { route = '/', path = route, loaderData = null, action, userValue = { user: null }, id = 'root' } = {}) {
  const providerValue = {
    ...userValue,
    login: userValue.login || vi.fn(), // Provide a mock function if one isn't passed
    logout: userValue.logout || vi.fn(),
  };

  const Stub = createRoutesStub([
    {
      id: id,
      path: path,
      Component: () => (
        <AuthContext.Provider value={providerValue}>
          {ui}
        </AuthContext.Provider>
      ),
      loader: () => loaderData,
      action: action,
      HydrateFallback: () => <div>Loading...</div> 
    },

    { path: "/", Component: () => <div>Home</div> },
    { path: "/login", Component: () => <div>Login</div> }
  ]);

  return render(<Stub initialEntries={[route]} />);
}


