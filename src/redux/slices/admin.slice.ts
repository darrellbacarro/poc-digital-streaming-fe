import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createActor, createGenre, createMovie, createUser, DataRoute, deleteActor, deleteGenre, deleteMovie, deleteUser, loadData, LoadDataFilter, reviewApproval, updateActor, updateGenre, updateMovie, updateUser } from "../../utils/api";
import { Actor, Genre, Movie, Review, User } from "../models";

export type AdminState = {
  users: { total: number, items: User[] };
  actors: { total: number, items: Actor[] };
  movies: { total: number, items: Movie[] };
  genres: { total: number, items: Genre[] };
  reviews: { total: number, items: Review[] };
};

export const initialState: AdminState = {
  users: { total: 0, items: [] },
  actors: { total: 0, items: [] },
  movies: { total: 0, items: [] },
  genres: { total: 0, items: [] },
  reviews: { total: 0, items: [] },
};

export const loadUsers = createAsyncThunk('admin/loadUsers', async (filter: LoadDataFilter = {}) => {
  const res = await loadData(DataRoute.Users, filter);
  return res;
});

export const loadActors = createAsyncThunk('admin/loadActors', async (filter: LoadDataFilter = {}) => {
  const res = await loadData(DataRoute.Actors, filter);
  return res;
});

export const loadMovies = createAsyncThunk('admin/loadMovies', async (filter: LoadDataFilter = {}) => {
  const res = await loadData(DataRoute.Movies, filter);
  return res;
});

export const loadGenres = createAsyncThunk('admin/loadGenres', async (filter: LoadDataFilter = {}) => {
  const res = await loadData(DataRoute.Genres, filter);
  return res;
});

export const loadReviews = createAsyncThunk('admin/loadReviews', async (filter: LoadDataFilter = {}) => {
  const res = await loadData(DataRoute.Reviews, filter);
  return res;
});

export const doUpdateUser = createAsyncThunk('admin/updateUser', async (data: { id: string, user: Partial<User> }) => {
  const res = await updateUser(data.id, data.user);
  return res;
});

export const doCreateUser = createAsyncThunk('admin/createUser', async (data: Partial<User>) => {
  const res = await createUser(data);
  return res;
});

export const doDeleteUser = createAsyncThunk('admin/deleteUser', async (id: string) => {
  const res = await deleteUser(id);
  return res;
});

export const doUpdateActor = createAsyncThunk('admin/updateActor', async (data: { id: string, actor: Partial<Actor> }) => {
  const res = await updateActor(data.id, data.actor);
  return res;
});

export const doCreateActor = createAsyncThunk('admin/createActor', async (data: Partial<Actor>) => {
  const res = await createActor(data);
  return res;
});

export const doDeleteActor = createAsyncThunk('admin/deleteActor', async (id: string) => {
  const res = await deleteActor(id);
  return res;
});

export const doUpdateMovie = createAsyncThunk('admin/updateMovie', async (data: { id: string, movie: Partial<Movie> }) => {
  const res = await updateMovie(data.id, data.movie);
  return res;
});

export const doCreateMovie = createAsyncThunk('admin/createMovie', async (data: Partial<Movie>) => {
  const res = await createMovie(data);
  return res;
});

export const doDeleteMovie = createAsyncThunk('admin/deleteMovie', async (id: string) => {
  const res = await deleteMovie(id);
  return res;
});

export const doUpdateGenre = createAsyncThunk('admin/updateGenre', async (data: { id: string, genre: Partial<Genre> }) => {
  const res = await updateGenre(data.id, data.genre);
  return res;
});

export const doCreateGenre = createAsyncThunk('admin/createGenre', async (data: Partial<Genre>) => {
  const res = await createGenre(data);
  return res;
});

export const doDeleteGenre = createAsyncThunk('admin/deleteGenre', async (id: string) => {
  const res = await deleteGenre(id);
  return res;
});

export const doReviewApproval = createAsyncThunk('admin/reviewApproval', async (data: { id: string, approved: boolean }) => {
  const res = await reviewApproval(data.id, { approved: data.approved });
  return res;
});

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(loadUsers.fulfilled, (state, action) => {
      state.users = action.payload.data;
    });
    builder.addCase(loadActors.fulfilled, (state, action) => {
      state.actors = action.payload.data;
    });
    builder.addCase(loadMovies.fulfilled, (state, action) => {
      state.movies = action.payload.data;
    });
    builder.addCase(loadGenres.fulfilled, (state, action) => {
      state.genres = action.payload.data;
    });
    builder.addCase(loadReviews.fulfilled, (state, action) => {
      state.reviews = action.payload.data;
    });
  },
});

export const adminReducer = adminSlice.reducer;