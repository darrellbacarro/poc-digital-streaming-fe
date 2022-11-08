import { act, fireEvent, screen } from '@testing-library/react';
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import App from "../App";
import { doLogin, doLogout, publicLoadMovies } from '../redux/slices';
import * as API from '../utils/api';
import { getMoviesResponse, loginAdminResponse, loginUserResponse, renderWithProviders } from "../utils/test-utils";

jest.mock("axios");
jest.mock("framer-motion", () => ({
  ...jest.requireActual("framer-motion"),
  useReducedMotion: () => true,
}));
describe("HomePage", () => {
  afterAll(() => jest.resetAllMocks());

  test("should render the page with movies as Guest", async () => {
    const history = createMemoryHistory();
    const { store } = renderWithProviders(
      <Router location={history.location} navigator={history}>
        <App />
      </Router>
    );

    jest.spyOn<typeof API, any>(API, 'loadData').mockResolvedValueOnce(getMoviesResponse);

    await act(async () => {
      await store.dispatch(publicLoadMovies({ page: 1, limit: 20 }));
    });
    
    expect(store.getState().public.movies.items.length).toBe(getMoviesResponse.data.items.length);
  });

  test("should allow login/logout as USER", async () => {
    const history = createMemoryHistory();
    const { store } = renderWithProviders(
      <Router location={history.location} navigator={history}>
        <App />
      </Router>
    );

    jest.spyOn<typeof API, any>(API, 'login').mockResolvedValueOnce(loginUserResponse);

    await act(async () => {
      await store.dispatch(doLogin({ email: '', password: '' }));
    });
    
    expect(store.getState().session.userData).not.toBeNull();
    expect(screen.getByText(loginUserResponse.data.user.fullname)).toBeInTheDocument();

    await act(async () => {
      await store.dispatch(doLogout());
    });
    expect(store.getState().session.userData).toBeNull();
    expect(store.getState().session.token).toBeNull();
  });

  test("should allow login/logout as ADMIN", async () => {
    const history = createMemoryHistory();
    const { store } = renderWithProviders(
      <Router location={history.location} navigator={history}>
        <App />
      </Router>
    );

    jest.spyOn<typeof API, any>(API, 'login').mockResolvedValueOnce(loginAdminResponse);

    await act(async () => {
      await store.dispatch(doLogin({ email: '', password: '' }));
    });

    const session = store.getState().session;
    
    expect(session.userData).not.toBeNull();
    expect(session.token).not.toBeNull();
    expect(screen.getByText(loginAdminResponse.data.user.fullname)).toBeInTheDocument();
    expect(session.userData?.role).toBe('ADMIN');
    expect(screen.getByText(/Admin Console/)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Admin Console/));
    expect(history.location.pathname).toBe('/cm');

    await act(async () => {
      await store.dispatch(doLogout());
    });
    expect(store.getState().session.userData).toBeNull();
    expect(store.getState().session.token).toBeNull();
  });
});
