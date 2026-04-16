import { expect, beforeAll, afterEach, afterAll } from 'vitest';
import { server } from '../src/mocks/server';
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  window.localStorage.clear(); // Keeps tests isolated
});
afterAll(() => server.close());