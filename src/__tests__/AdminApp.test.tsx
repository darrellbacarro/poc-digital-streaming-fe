import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import App from "../App";
import { doLogin } from "../redux";
import { loadActors, loadGenres, loadMovies, loadUsers } from "../redux/slices";
import { renderWithProviders } from "../utils/test-utils";

describe("Admin App", () => {
  const history = createMemoryHistory();

  test("should redirect on unauthorized access", async () => {
    history.replace('/cm');
    const { store } = renderWithProviders(
      <Router location={history.location} navigator={history}>
        <App />
      </Router>
    );
    
    expect(screen.getAllByText(/Unauthorized/i).length).toBeGreaterThan(0);
    await act(async () => {
      await store.dispatch(doLogin({email: 'admin@email.com', password: '123'}));
    });
  });

  test("should access the admin page after login", async () => {
    history.replace('/cm');
    const { store } = renderWithProviders(
      <Router location={history.location} navigator={history}>
        <App />
      </Router>
    );
    
    expect(screen.getByText(/Public Homepage/i)).toBeInTheDocument();
  });

  test("should open actor delete confirm dialog", async () => {
    history.replace('/cm/actors');
    const { store } = renderWithProviders(
      <Router location={history.location} navigator={history}>
        <App />
      </Router>
    );

    await act(async () => {
      await store.dispatch(loadActors());
    });

    expect(store.getState().admin.actors.items.length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Delete/i).length).toBeGreaterThan(0);
    
    await act(async () => {
      userEvent.click(screen.getAllByText(/Delete/i)[0]);
    });
    expect(screen.getByText(/Delete Actor/i)).toBeInTheDocument();

    const dialog = screen.getByRole('dialog');
    const deleteBtn = dialog.querySelectorAll('button')[2];

    await act(async () => {
      userEvent.click(deleteBtn);
    });

    expect(screen.getByText(/Actor deleted successfully!/i)).toBeInTheDocument();
  });

  test("should open user delete confirm dialog", async () => {
    history.replace('/cm/users');
    const { store } = renderWithProviders(
      <Router location={history.location} navigator={history}>
        <App />
      </Router>
    );

    await act(async () => {
      await store.dispatch(loadUsers());
    });

    expect(store.getState().admin.users.items.length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Delete/i).length).toBeGreaterThan(0);
    
    await act(async () => {
      userEvent.click(screen.getAllByText(/Delete/i)[1]);
    });
    expect(screen.getByText(/Delete User/i)).toBeInTheDocument();

    const dialog = screen.getByRole('dialog');
    const deleteBtn = dialog.querySelectorAll('button')[2];

    await act(async () => {
      userEvent.click(deleteBtn);
    });

    expect(screen.getByText(/User deleted successfully!/i)).toBeInTheDocument();
  });

  test("should open genre delete confirm dialog", async () => {
    history.replace('/cm/genres');
    const { store } = renderWithProviders(
      <Router location={history.location} navigator={history}>
        <App />
      </Router>
    );

    await act(async () => {
      await store.dispatch(loadGenres());
    });

    expect(store.getState().admin.genres.items.length).toBeGreaterThan(0);
    const deleteBtns = screen.getAllByText(/Delete/i);
    expect(deleteBtns.length).toBeGreaterThan(0);
    
    await act(async () => {
      userEvent.click(screen.getAllByText(/Delete/i)[deleteBtns.length - 1]);
    });
    expect(screen.getByText(/Delete Genre/i)).toBeInTheDocument();

    const dialog = screen.getByRole('dialog');
    const deleteBtn = dialog.querySelectorAll('button')[2];

    await act(async () => {
      userEvent.click(deleteBtn);
    });

    expect(screen.getByText(/Genre deleted successfully!/i)).toBeInTheDocument();
  });

  test("should open user edit form on click", async () => {
    history.replace('/cm/users');
    const { store } = renderWithProviders(
      <Router location={history.location} navigator={history}>
        <App />
      </Router>
    );

    await act(async () => {
      await store.dispatch(loadUsers());
    });

    expect(store.getState().admin.users.items.length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Edit/i).length).toBeGreaterThan(0);
    
    await act(async () => {
      userEvent.click(screen.getAllByText(/Edit/i)[0]);
    });
    expect(screen.getByText(/Edit User/i)).toBeInTheDocument();
  });

  test("should validate user form required fields", async () => {
    history.replace('/cm/users');
    const { container } = renderWithProviders(
      <Router location={history.location} navigator={history}>
        <App />
      </Router>
    );
    
    expect(screen.getAllByText(/Users/i).length).toBeGreaterThan(0);
    const btn = screen.getByTestId('add-user-btn');

    await act(async () => {
      userEvent.click(btn);
    });
    const submitBtn = screen.getByTestId('user-form-submit');

    await act(async () => {
      userEvent.click(submitBtn);
    });

    expect(screen.getAllByText(/Fullname is required/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Password is required/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Email is required/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Please confirm your password/).length).toBeGreaterThan(0);
  });

  test("should validate movie form required fields", async () => {
    history.replace('/cm/movies');
    const { container } = renderWithProviders(
      <Router location={history.location} navigator={history}>
        <App />
      </Router>
    );
    
    expect(screen.getAllByText(/Movies/i).length).toBeGreaterThan(0);
    const btn = screen.getByTestId('add-movie-btn');

    await act(async () => {
      userEvent.click(btn);
    });
    const submitBtn = screen.getByTestId('movie-form-submit');

    await act(async () => {
      userEvent.click(submitBtn);
    });

    expect(screen.getAllByText(/Poster is required/).length).toBeGreaterThan(0);
  });

  test("should open movie edit form on click", async () => {
    history.replace('/cm/movies');
    const { store } = renderWithProviders(
      <Router location={history.location} navigator={history}>
        <App />
      </Router>
    );

    await act(async () => {
      await store.dispatch(loadMovies());
    });

    expect(store.getState().admin.movies.items.length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Edit/i).length).toBeGreaterThan(0);
    
    await act(async () => {
      userEvent.click(screen.getAllByText(/Edit/i)[0]);
    });
    expect(screen.getByText(/Edit Movie/i)).toBeInTheDocument();
  });
});
