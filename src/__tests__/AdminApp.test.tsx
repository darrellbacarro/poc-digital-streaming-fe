import { act, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import AdminApp from "../admin/AdminApp";
import App from "../App";
import { setupStore } from "../redux";
import {
  doLogin,
  loadActors,
  loadGenres,
  loadMovies,
  loadReviews,
  loadUsers
} from "../redux/slices";
import { renderWithProviders, withRouter } from "../utils/test-utils";

const mockedUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUseNavigate,
}));

describe("Admin App", () => {
  const history = createMemoryHistory();
  let store: ReturnType<typeof setupStore>;

  beforeAll(() => {
    store = setupStore();
  });

  test("should redirect on unauthorized access", async () => {
    renderWithProviders(withRouter(AdminApp, { path: "/cm/*", route: "/cm" }), {
      store,
    });

    expect(store.getState().session.userData).toBeNull();
    expect(mockedUseNavigate).toHaveBeenCalledWith("/");
  });

  test("should access the admin page after admin login", async () => {
    await act(async () => {
      await store.dispatch(
        doLogin({ email: "admin@email.com", password: "123" })
      );
    });

    renderWithProviders(withRouter(AdminApp, { path: "/cm/*", route: "/cm" }), {
      store,
    });

    expect(screen.getByText(/Public Homepage/)).toBeInTheDocument();
  });

  test("should open actor delete confirm dialog", async () => {
    await act(async () => {
      await store.dispatch(loadActors());
    });

    renderWithProviders(
      withRouter(AdminApp, { path: "/cm/*", route: "/cm/actors" }),
      { store }
    );

    expect(store.getState().admin.actors.items.length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Delete/i).length).toBeGreaterThan(0);

    await act(async () => {
      userEvent.click(screen.getAllByText(/Delete/i)[0]);
    });
    expect(screen.getByText(/Delete Actor/i)).toBeInTheDocument();

    const dialog = screen.getByRole("dialog");
    const deleteBtn = dialog.querySelectorAll("button")[2];

    await act(async () => {
      userEvent.click(deleteBtn);
    });

    expect(
      screen.getByText(/Actor deleted successfully!/i)
    ).toBeInTheDocument();
  });

  test("should open user delete confirm dialog", async () => {
    await act(async () => {
      await store.dispatch(loadUsers());
    });

    renderWithProviders(
      withRouter(AdminApp, { path: "/cm/*", route: "/cm/users" }),
      { store }
    );

    expect(store.getState().admin.users.items.length).toBeGreaterThan(0);

    const deleteBtns = screen.getAllByText(/Delete/i);
    expect(deleteBtns.length).toBeGreaterThan(0);

    await act(async () => {
      userEvent.click(deleteBtns[deleteBtns.length - 1]);
    });
    expect(screen.getByText(/Delete User/i)).toBeInTheDocument();

    const dialog = screen.getByRole("dialog");
    const deleteBtn = dialog.querySelectorAll("button")[2];

    await act(async () => {
      userEvent.click(deleteBtn);
    });

    expect(screen.getByText(/User deleted successfully!/i)).toBeInTheDocument();
  });

  test("should open genre delete confirm dialog", async () => {
    await act(async () => {
      await store.dispatch(loadGenres());
    });

    renderWithProviders(
      withRouter(AdminApp, { path: "/cm/*", route: "/cm/genres" }),
      { store }
    );

    expect(store.getState().admin.genres.items.length).toBeGreaterThan(0);

    const deleteBtns = screen.getAllByText(/Delete/i);
    expect(deleteBtns.length).toBeGreaterThan(0);

    await act(async () => {
      userEvent.click(deleteBtns[deleteBtns.length - 1]);
    });
    expect(screen.getByText(/Delete Genre/i)).toBeInTheDocument();

    const dialog = screen.getByRole("dialog");
    const deleteBtn = dialog.querySelectorAll("button")[2];

    await act(async () => {
      userEvent.click(deleteBtn);
    });

    expect(
      screen.getByText(/Genre deleted successfully!/i)
    ).toBeInTheDocument();
  });

  test("should open movie delete confirm dialog", async () => {
    await act(async () => {
      await store.dispatch(loadMovies());
    });

    renderWithProviders(
      withRouter(AdminApp, { path: "/cm/*", route: "/cm/movies" }),
      { store }
    );

    expect(store.getState().admin.movies.items.length).toBeGreaterThan(0);

    const deleteBtns = screen.getAllByText(/Delete/i);
    expect(deleteBtns.length).toBeGreaterThan(0);

    await act(async () => {
      userEvent.click(deleteBtns[deleteBtns.length - 1]);
    });
    expect(screen.getByText(/Delete Movie/i)).toBeInTheDocument();

    const dialog = screen.getByRole("dialog");
    const deleteBtn = dialog.querySelectorAll("button")[2];

    await act(async () => {
      userEvent.click(deleteBtn);
    });

    expect(
      screen.getByText(/Movie deleted successfully!/i)
    ).toBeInTheDocument();
  });

  test("should update review approval status on select input change", async () => {
    await act(async () => {
      await store.dispatch(loadReviews());
    });

    renderWithProviders(
      withRouter(AdminApp, { path: "/cm/*", route: "/cm/reviews" }),
      { store }
    );

    expect(store.getState().admin.reviews.items.length).toBeGreaterThan(0);

    const selectInputs =
      screen.getAllByTestId<HTMLSelectElement>("approval-select");
    expect(selectInputs.length).toBeGreaterThan(0);

    const approvalSelect = selectInputs[selectInputs.length - 1].querySelector(
      "select"
    ) as Element;

    await act(async () => {
      userEvent.selectOptions(approvalSelect, ["APPROVED"], { bubbles: true });
    });

    expect(screen.getByText(/Review approval updated/i)).toBeInTheDocument();
  });

  test("should open user edit form on click", async () => {
    await act(async () => {
      await store.dispatch(loadUsers());
    });

    renderWithProviders(
      withRouter(AdminApp, { path: "/cm/*", route: "/cm/users" }),
      { store }
    );

    expect(store.getState().admin.users.items.length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Edit/i).length).toBeGreaterThan(0);

    await act(async () => {
      userEvent.click(screen.getAllByText(/Edit/i)[0]);
    });
    expect(screen.getByText(/Edit User/i)).toBeInTheDocument();
  });

  test("should validate user form fields", async () => {
    renderWithProviders(
      withRouter(AdminApp, { path: "/cm/*", route: "/cm/users" }),
      { store }
    );

    expect(screen.getByTestId("add-user-btn")).toBeInTheDocument();

    await act(async () => {
      userEvent.click(screen.getByTestId("add-user-btn"));
    });
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const dialog = screen.getByRole("dialog");
    const saveBtn = dialog.querySelectorAll("button")[3];

    expect(saveBtn.textContent).toBe("Save");

    await act(async () => {
      userEvent.click(saveBtn);
    });

    expect(screen.getAllByText(/Fullname is required/).length).toBeGreaterThan(
      0
    );
    expect(screen.getAllByText(/Password is required/).length).toBeGreaterThan(
      0
    );
    expect(screen.getAllByText(/Email is required/).length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/Please confirm your password/).length
    ).toBeGreaterThan(0);

    const fullname = screen.getByLabelText("Fullname");
    const email = screen.getByLabelText("Email Address");
    const password = screen.getByLabelText("Password");
    const confirmPassword = screen.getByLabelText("Confirm Password");
    const photo = screen
      .getByTestId("user-photo")
      .querySelector("input") as Element;

    expect(photo).toBeInTheDocument();

    await act(async () => {
      fireEvent.input(fullname, { target: { value: "John Doe" } });
      fireEvent.input(email, { target: { value: "johndoe@email.com" } });
      fireEvent.input(password, { target: { value: "123" } });
      fireEvent.input(confirmPassword, { target: { value: "234" } });
    });

    expect(screen.getByText(/Passwords do not match/)).toBeInTheDocument();

    await act(async () => {
      fireEvent.input(confirmPassword, { target: { value: "123" } });
      fireEvent.change(photo, {
        target: {
          files: [
            new File(["(⌐□_□)"], "chucknorris.png", { type: "image/png" }),
          ],
        },
      });
    });

    expect(saveBtn.getAttribute("disabled")).toBe(null);

    await act(async () => {
      userEvent.click(saveBtn);
    });

    expect(screen.getByText(/Registration successful!/i)).toBeInTheDocument();
  });

  test("should validate movie form required fields", async () => {
    renderWithProviders(
      withRouter(AdminApp, { path: "/cm/*", route: "/cm/movies" }),
    );

    expect(screen.getAllByText(/Movies/i).length).toBeGreaterThan(0);
    const btn = screen.getByTestId("add-movie-btn");

    await act(async () => {
      userEvent.click(btn);
    });
    const submitBtn = screen.getByTestId("movie-form-submit");

    await act(async () => {
      userEvent.click(submitBtn);
    });

    expect(screen.getAllByText(/Title is required/).length).toBeGreaterThan(0);
  });

  test("should open movie edit form on click", async () => {
    history.replace("/cm/movies");
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
