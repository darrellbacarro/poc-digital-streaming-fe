import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import MoviePage from "../../pages/MoviePage";
import { setupStore } from "../../redux";
import { publicInitialState } from "../../redux/slices";
import { moviePageData } from "../../utils/mock-api";
import { renderWithProviders, withRouter } from "../../utils/test-utils";

describe("MoviePage", () => {
  test("should render the movie page with the movie details and reviews", async () => {
    const store = setupStore({
      public: {
        ...publicInitialState,
        ...moviePageData,
      },
    });

    const { getByRole, getAllByText } = renderWithProviders(
      withRouter(MoviePage, { route: "/", path: "/", isPublic: true }),
      { store }
    );

    expect(
      getByRole("heading", { name: moviePageData.currentMovie.title })
    ).toBeInTheDocument();
    expect(
      getAllByText(moviePageData.currentMovie.release_year).length
    ).toBeGreaterThan(0);
    expect(store.getState().public.currentMovieReviews.items.length).toBe(
      moviePageData.currentMovieReviews.items.length
    );
  });

  test("should render the movie page with the movie details and empty reviews", async () => {
    const store = setupStore({
      public: {
        ...publicInitialState,
        currentMovie: moviePageData.currentMovie,
      },
    });

    renderWithProviders(
      withRouter(MoviePage, { route: "/", path: "/", isPublic: true }),
      { store }
    );
  });

  test("should hide the review form if the user is not logged in", async () => {
    const store = setupStore({
      public: {
        ...publicInitialState,
        ...moviePageData,
      },
    });

    const { queryByRole, getByText } = renderWithProviders(
      withRouter(MoviePage, { route: "/", path: "/", isPublic: true }),
      { store }
    );

    expect(queryByRole("form")).not.toBeInTheDocument();
    expect(getByText(/You must be logged in to write a review/)).toBeInTheDocument();
  });

  test("should hide the review form if the user is an admin", async () => {
    const store = setupStore({
      session: {
        token: "token",
        userData: {
          id: "1",
          fullname: "John Doe",
          email: "johndoe@email.com",
          approved: true,
          role: "ADMIN",
          favorites: {},
          enabled: true,
        },
      },
      public: {
        ...publicInitialState,
        ...moviePageData,
      },
    });

    const { queryByRole, getByText } = renderWithProviders(
      withRouter(MoviePage, { route: "/", path: "/", isPublic: true }),
      { store }
    );

    expect(queryByRole("form")).not.toBeInTheDocument();
    expect(getByText(/Admins cannot write reviews/)).toBeInTheDocument();
  });

  test("should submit reviews", async () => {
    const store = setupStore({
      session: {
        token: "token",
        userData: {
          id: "1",
          fullname: "John Doe",
          email: "johndoe@email.com",
          approved: true,
          role: "USER",
          favorites: {},
          enabled: true,
        },
      },
      public: {
        ...publicInitialState,
        ...moviePageData,
      },
    });

    const { getByTestId } = renderWithProviders(
      withRouter(MoviePage, { route: "/", path: "/", isPublic: true }),
      { store }
    );

    const submitReviewBtn = getByTestId("submit-review-btn");
    expect(submitReviewBtn).toBeInTheDocument();

    await act(async () => {
      userEvent.type(getByTestId("review-input"), "This is a review");
      userEvent.click(getByTestId("rate-btn"));
      userEvent.click(submitReviewBtn);
    });

    expect(getByTestId("review-input")).toHaveValue("This is a review");
  });
});
