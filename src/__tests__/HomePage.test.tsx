import { act, fireEvent, screen } from '@testing-library/react';
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import App from "../App";
import { doLogin, doLogout, publicLoadMovies } from '../redux/slices';
import { renderWithProviders } from "../utils/test-utils";

describe("HomePage", () => {
  test("should render the page with movies as Guest", async () => {
    const history = createMemoryHistory();
    const { store } = renderWithProviders(
      <Router location={history.location} navigator={history}>
        <App />
      </Router>
    );

    await act(async () => {
      await store.dispatch(publicLoadMovies());
    });
    expect(store.getState().public.movies.items.length).toBeGreaterThan(0);
  });

  test("should allow login/logout as USER", async () => {
    const history = createMemoryHistory();
    const { store } = renderWithProviders(
      <Router location={history.location} navigator={history}>
        <App />
      </Router>
    );

    await act(async () => {
      await store.dispatch(doLogin({ email: 'test@email.com ', password: '123' }));
    });
    
    const user = store.getState().session.userData;

    expect(user).not.toBeNull();
    expect(user?.role).toBe('USER');

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

    await act(async () => {
      await store.dispatch(doLogin({ email: 'admin@email.com', password: '123' }));
    });

    const session = store.getState().session;
    
    expect(session.userData).not.toBeNull();
    expect(session.token).not.toBeNull();
    expect(session.userData?.role).toBe('ADMIN');
    expect(screen.getByTestId(/Content Management/)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId(/Content Management/));
    expect(history.location.pathname).toBe('/cm');

    await act(async () => {
      await store.dispatch(doLogout());
    });
    expect(store.getState().session.userData).toBeNull();
    expect(store.getState().session.token).toBeNull();
  });
});
