import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUser,
  DataRoute,
  getActorInfo,
  getFavorites,
  getMovieInfo,
  getMovieReviews,
  getMoviesByGenre,
  loadData,
  submitReview
} from "../../utils/api";
import { getRandomInt } from "../../utils/helpers";
import { Actor, Genre, Movie, Review, User } from "../models";

export type PublicState = {
  movies: { total: number; items: Movie[] };
  genres: { total: number; items: Genre[] };
  actors: { total: number; items: Actor[] };
  featured: Movie | null;
  currentMovie: Movie | null;
  currentActor: Actor | null;
  currentMovieReviews: { total: number; items: Review[] };
  searchResults: { movies: Movie[]; actors: Actor[] };
  currentGenre: Genre | null;
  favoriteMovies: Movie[];
};

export const publicInitialState: PublicState = {
  movies: { total: 0, items: [] },
  genres: { total: 0, items: [] },
  actors: { total: 0, items: [] },
  currentMovieReviews: { total: 0, items: [] },
  featured: null,
  currentMovie: null,
  searchResults: { movies: [], actors: [] },
  currentActor: null,
  currentGenre: null,
  favoriteMovies: [],
};

export const doSearch = createAsyncThunk(
  "public/search",
  async (query: string) => {
    const movieRes = await loadData(DataRoute.Movies, { q: query });
    const actorRes = await loadData(DataRoute.Actors, { q: query });

    return { movies: movieRes.data.items, actors: actorRes.data.items };
  }
);

export const publicLoadActors = createAsyncThunk(
  "public/publicLoadActors",
  async (filter: { page: number; limit: number }) => {
    const res = await loadData(DataRoute.Actors, filter);
    return res.data;
  }
);

export const loadActorInfo = createAsyncThunk(
  "public/loadActorInfo",
  async (id: string) => {
    const res = await getActorInfo(id);
    return res.data;
  }
);

export const publicLoadMovies = createAsyncThunk(
  "public/publicLoadMovies",
  async (filter: { page: number; limit: number }) => {
    const res = await loadData(DataRoute.Movies, filter);
    return res.data;
  }
);

export const loadMovieInfo = createAsyncThunk(
  "public/loadMovieInfo",
  async (id: string) => {
    const res = await getMovieInfo(id);
    return res.data;
  }
);

export const loadMovieReviews = createAsyncThunk(
  "public/loadMovieReviews",
  async (data: { id: string; page: number; limit: number }) => {
    const res = await getMovieReviews(data.id, {
      page: data.page,
      limit: data.limit,
    });
    return res.data;
  }
);

export const doSubmitReview = createAsyncThunk(
  "public/doSubmitReview",
  async (data: Partial<Review>) => {
    const res = await submitReview(data);
    return res;
  }
);

export const loadAllGenres = createAsyncThunk(
  "public/loadAllGenres",
  async () => {
    const res = await loadData(DataRoute.Genres);
    return res.data;
  }
);

export const loadMoviesByGenre = createAsyncThunk(
  "public/loadMoviesByGenre",
  async (id: string) => {
    const res = await getMoviesByGenre(id);
    return res.data;
  }
);

export const loadFavoriteMovies = createAsyncThunk(
  "public/loadFavoriteMovies",
  async (id: string) => {
    const res = await getFavorites(id);
    return res.data;
  }
);

export const signUp = createAsyncThunk("public/signUp", async (data: Partial<User>) => {
  const res = await createUser(data);
  return res;
});

export const publicSlice = createSlice({
  name: "public",
  initialState: publicInitialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = { movies: [], actors: [] };
    },
    clearCurrentMovie: (state) => {
      state.currentMovie = null;
    },
    clearCurrentMovieReviews: (state) => {
      state.currentMovieReviews = { total: 0, items: [] };
    },
    clearCurrentActor: (state) => {
      state.currentActor = null;
    },
    clearGenreMovies: (state) => {
      state.currentGenre = null;
    },
    clearFavoriteMovies: (state) => {
      state.favoriteMovies = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(doSearch.fulfilled, (state, action) => {
      state.searchResults = action.payload;
    });
    builder.addCase(publicLoadActors.fulfilled, (state, action) => {
      state.actors = action.payload;
    });
    builder.addCase(loadActorInfo.fulfilled, (state, action) => {
      state.currentActor = action.payload;
    });
    builder.addCase(publicLoadMovies.fulfilled, (state, action) => {
      const { items, total } = action.payload;
      state.movies = { items, total };
      state.featured = items[getRandomInt(0, items.length - 1)];
    });
    builder.addCase(loadMovieInfo.fulfilled, (state, action) => {
      state.currentMovie = action.payload;
    });
    builder.addCase(loadMovieReviews.fulfilled, (state, action) => {
      state.currentMovieReviews = action.payload;
    });
    builder.addCase(loadAllGenres.fulfilled, (state, action) => {
      state.genres = action.payload;
    });
    builder.addCase(loadMoviesByGenre.fulfilled, (state, action) => {
      state.currentGenre = action.payload;
    });
    builder.addCase(loadFavoriteMovies.fulfilled, (state, action) => {
      state.favoriteMovies = action.payload;
    });
  },
});

export const {
  clearSearchResults,
  clearCurrentActor,
  clearCurrentMovie,
  clearCurrentMovieReviews,
  clearGenreMovies,
  clearFavoriteMovies,
} = publicSlice.actions;
export const publicReducer = publicSlice.reducer;
