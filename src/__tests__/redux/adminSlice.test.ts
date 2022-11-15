import { setupStore } from "../../redux";
import { initialState, loadActors, loadGenres, loadMovies, loadReviews, loadUsers } from "../../redux/slices";

const store = setupStore();

describe("admin reducer", () => {
  test("should return the initial state", async () => {
    const state = store.getState();

    expect(state.admin).toStrictEqual(initialState);
  });

  test("should update state on loadUsers dispatch", async () => {
    await store.dispatch(loadUsers());

    const state = store.getState().admin;
    expect(state.users.items.length).toBeGreaterThan(0);
  });

  test("should update state on loadActors dispatch", async () => {
    await store.dispatch(loadActors());

    const state = store.getState().admin;
    expect(state.actors.items.length).toBeGreaterThan(0);
  });

  test("should update state on loadMovies dispatch", async () => {
    await store.dispatch(loadMovies());

    const state = store.getState().admin;
    expect(state.movies.items.length).toBeGreaterThan(0);
  });

  test("should update state on loadGenres dispatch", async () => {
    await store.dispatch(loadGenres());

    const state = store.getState().admin;
    expect(state.genres.items.length).toBeGreaterThan(0);
  });

  test("should update state on loadReviews dispatch", async () => {
    await store.dispatch(loadReviews());

    const state = store.getState().admin;
    expect(state.reviews.items.length).toBeGreaterThan(0);
  });
});
