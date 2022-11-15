import { setupStore } from "../../redux";
import { clearSearchResults, doSearch, loadActorInfo, loadAllGenres, loadMovieInfo, publicInitialState, publicLoadActors, publicLoadMovies } from "../../redux/slices";

const store = setupStore();

describe("public reducer", () => {
  test("should return the initial state", async () => {
    const state = store.getState();

    expect(state.public).toStrictEqual(publicInitialState);
  });

  test("should return search results", async () => {
    await store.dispatch(doSearch("test"));

    const { actors, movies } = store.getState().public.searchResults;
    expect(actors.length).toBeGreaterThan(0);
    expect(movies.length).toBeGreaterThan(0);
  });

  test("should clear search results", async () => {
    await store.dispatch(doSearch("test"));
    await store.dispatch(clearSearchResults());

    const { actors, movies } = store.getState().public.searchResults;
    expect(actors.length).toBe(0);
    expect(movies.length).toBe(0);
  });

  test("should load actors", async () => {
    await store.dispatch(publicLoadActors());

    const { actors } = store.getState().public;
    expect(actors.items.length).toBeGreaterThan(0);
  });

  test("should load movies", async () => {
    await store.dispatch(publicLoadMovies());

    const { movies } = store.getState().public;
    expect(movies.items.length).toBeGreaterThan(0);
  });

  test("should load genres", async () => {
    await store.dispatch(loadAllGenres());

    const { genres } = store.getState().public;
    expect(genres.items.length).toBeGreaterThan(0);
  });

  test("should load actor info", async () => {
    await store.dispatch(loadActorInfo("1"));

    const { currentActor } = store.getState().public;
    expect(currentActor).not.toBeNull();
  });

  test("should load movie info", async () => {
    await store.dispatch(loadMovieInfo("1"));

    const { currentMovie } = store.getState().public;
    expect(currentMovie).not.toBeNull();
  });
});
