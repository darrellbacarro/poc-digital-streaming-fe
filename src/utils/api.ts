import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';
import dayjs from 'dayjs';
import { Actor, Genre, Movie, Review, User } from '../redux/models';
import { getCookie } from './helpers';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

type ApiData<T = any> = {
  success: boolean;
  message: string;
  data: T;
  error?: string | object;
};

/**
 * A wrapper for the axios library that adds the auth token to the request.           
 * @param {string} path - the path to the API endpoint           
 * @param {AxiosRequestConfig} [opts={}] - the options to pass to axios           
 * @returns The response from the API.           
 */
const rqst = async <T = ApiData>(path: string, opts: AxiosRequestConfig = {}): Promise<T> => {
  const cookie = getCookie('auth-token');
  const options = {
    url: path,
    credentials: 'include',
    mode: 'cors',
    params: { t: Date.now() },
    ...opts,
  };

  if (cookie) {
    if (!options.headers) options.headers = {};
    options.headers['Authorization'] = `Bearer ${cookie}`;
  }

  const res = await axios(options);
  let data = res;

  try {
    if (!options.responseType) data = res.data;
  } catch (e) { }

  return data as T;
};

/**
 * Login request function
 * @param {string} email User email
 * @param {string} password User password
 * @returns {object | null} Response data
 */
 export const login = async (email: string, password: string): Promise<ApiData> => {
  const res = await rqst<ApiData>('/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { email, password },
  });
  const expiry = dayjs().add(1, 'year').format('YYYY-MM-DD HH:mm:ss');

  if (res.success)
    document.cookie = `auth-token=${res.data.token}; expires=${expiry}; path=/;`;

  return res;
};

/**
 * Logs the user out of the application.           
 * @returns None           
 */
export const logout = async (): Promise<void> => {
  document.cookie = "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

/**
 * An enum of the possible routes for the data.       
 */
export enum DataRoute {
  Users = 'users',
  Reviews = 'reviews',
  Genres = 'genres',
  Movies = 'movies',
  Actors = 'actors',
}

/**
 * A filter object that can be used to filter the data returned from the API.       
 * @typedef {object} LoadDataFilter       
 * @property {string} [q] - A search query to filter the data by.       
 * @property {number} [page] - The page number to return.       
 * @property {number} [limit] - The number of items to return.       
 * @property {string} [sort] - The sort order to return the data in.       
 * @property {object} [filter] - Any other filter to apply to the data.       
 */
export type LoadDataFilter = {
  q?: string;
  page?: number;
  limit?: number;
  sort?: string;
  [key: string]: any;
};

/**
 * Loads data from the API.           
 * @param {DataRoute} col - The collection to load data from.           
 * @param {LoadDataFilter} [filter={}] - The filter to apply to the data.           
 * @returns {Promise<ApiData>} - The data from the API.           
 */
export const loadData = async (
  col: DataRoute,
  filter: LoadDataFilter = {},
): Promise<ApiData> => {
  const res = await rqst<ApiData>(`/${col}`, {
    method: 'GET',
    params: filter,
  });
  return res;
};

/**
 * Update the user with the given id.       
 * @param {string} id - the id of the user to update       
 * @param {Partial<User>} data - the data to update the user with       
 * @returns {Promise<ApiData>} - the updated user       
 */
export const updateUser = async (id: string, data: Partial<User>): Promise<ApiData> => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  const res = await rqst<ApiData>(`/users/${id}`, {
    method: 'PATCH',
    data: formData,
  });

  return res;
};

/**
 * Creates a new user in the database.           
 * @param {Partial<User>} data - the data to create the user with.           
 * @returns {Promise<ApiData>} - the data returned from the server.           
 */
export const createUser = async (data: Partial<User>): Promise<ApiData> => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  const res = await rqst<ApiData>(`/users/register`, {
    method: 'POST',
    data: formData,
  });

  return res;
};

/**
 * Deletes the user with the given id.           
 * @param {string} id - the id of the user to delete           
 * @returns {Promise<ApiData>} - the data returned by the API           
 */
export const deleteUser = async (id: string): Promise<ApiData> => {
  const res = await rqst<ApiData>(`/users/${id}`, {
    method: 'DELETE',
  });

  return res;
};

/**
 * Update an actor.       
 * @param {string} id - the id of the actor to update       
 * @param {Partial<Actor>} data - the data to update the actor with       
 * @returns {Promise<ApiData>} - the updated actor       
 */
export const updateActor = async (id: string, data: Partial<Actor>): Promise<ApiData> => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  const res = await rqst<ApiData>(`/actors/${id}`, {
    method: 'PATCH',
    data: formData,
  });

  return res;
};

/**
 * Creates a new actor.           
 * @param {Partial<Actor>} data - the data to send to the server.           
 * @returns {Promise<ApiData>} - the data returned from the server.           
 */
export const createActor = async (data: Partial<Actor>): Promise<ApiData> => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  const res = await rqst<ApiData>(`/actors`, {
    method: 'POST',
    data: formData,
  });

  return res;
};

/**
 * Deletes the actor with the given id.           
 * @param {string} id - the id of the actor to delete           
 * @returns {Promise<ApiData>} - a promise that resolves to the data returned by the server.           
 */
export const deleteActor = async (id: string): Promise<ApiData> => {
  const res = await rqst<ApiData>(`/actors/${id}`, {
    method: 'DELETE',
  });

  return res;
};

/**
 * Update a movie in the database.           
 * @param {string} id - the id of the movie to update           
 * @param {Partial<Movie>} data - the data to update the movie with           
 * @returns {Promise<ApiData>} - the updated movie           
 */
export const updateMovie = async (id: string, data: Partial<Movie>): Promise<ApiData> => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (['actors', 'genres'].includes(key)) {
      formData.append(key, JSON.stringify(data[key]));
    } else {
      formData.append(key, data[key]);
    }
  });

  const res = await rqst<ApiData>(`/movies/${id}`, {
    method: 'PATCH',
    data: formData,
  });

  return res;
};

/**
 * Creates a new movie in the database.       
 * @param {Partial<Movie>} data - the data to create the movie with       
 * @returns {Promise<ApiData>} - the data from the server       
 */
export const createMovie = async (data: Partial<Movie>): Promise<ApiData> => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (['actors', 'genres'].includes(key)) {
      formData.append(key, JSON.stringify(data[key]));
    } else {
      formData.append(key, data[key]);
    }
  });

  const res = await rqst<ApiData>(`/movies`, {
    method: 'POST',
    data: formData,
  });

  return res;
};

/**
 * Deletes a movie from the database.           
 * @param {string} id - the id of the movie to delete           
 * @returns {Promise<ApiData>} - a promise that resolves to the data returned from the server           
 */
export const deleteMovie = async (id: string): Promise<ApiData> => {
  const res = await rqst<ApiData>(`/movies/${id}`, {
    method: 'DELETE',
  });

  return res;
};

/**
 * Update a genre in the database.       
 * @param {string} id - The id of the genre to update.       
 * @param {Partial<Genre>} data - The data to update the genre with.       
 * @returns {Promise<ApiData>} - The updated genre.       
 */
export const updateGenre = async (id: string, data: Partial<Genre>): Promise<ApiData> => {
  const res = await rqst<ApiData>(`/genres/${id}`, {
    method: 'PATCH',
    data,
  });

  return res;
};

/**
 * Creates a new genre.           
 * @param {Partial<Genre>} data - the data to send to the server.           
 * @returns {Promise<ApiData>} - the data returned from the server.           
 */
export const createGenre = async (data: Partial<Genre>): Promise<ApiData> => {
  const res = await rqst<ApiData>(`/genres`, {
    method: 'POST',
    data,
  });

  return res;
};

/**
 * Deletes a genre from the database.           
 * @param {string} id - the id of the genre to delete           
 * @returns {ApiData} - the data returned from the API           
 */
export const deleteGenre = async (id: string): Promise<ApiData> => {
  const res = await rqst<ApiData>(`/genres/${id}`, {
    method: 'DELETE',
  });

  return res;
};

/**
 * Approves or rejects a review.           
 * @param {string} id - the id of the review to approve or reject           
 * @param {boolean} approved - whether or not the review should be approved           
 * @returns {ApiData} - the data returned from the API           
 */
export const reviewApproval = async (id: string, data: { approved: boolean }): Promise<ApiData> => {
  const res = await rqst<ApiData>(`/reviews/${id}/approval`, {
    method: 'PATCH',
    data,
  });

  return res;
};

/**
 * Gets the actor info for the given actor ID.           
 * @param {string} id - the ID of the actor to get the info for.           
 * @returns {Promise<ApiData>} - the actor info for the given actor ID.           
 */
export const getActorInfo = async (id: string): Promise<ApiData> => {
  const res = await rqst<ApiData>(`/actors/${id}`, {
    method: 'GET',
    params: { includeMovies: true },
  });

  return res;
};

/**
 * Gets the movie info for the given movie id.       
 * @param {string} id - the id of the movie to get info for.       
 * @returns {Promise<ApiData>} - a promise that resolves to the movie info.       
 */
export const getMovieInfo = async (id: string): Promise<ApiData> => {
  const res = await rqst<ApiData>(`/movies/${id}`);
  return res;
};

/**
 * Gets the reviews for a movie.           
 * @param {string} id - the id of the movie.           
 * @param {LoadDataFilter} [filter={}] - the filter to apply to the request.           
 * @returns {ApiData} - the data returned from the API.           
 */
export const getMovieReviews = async (id: string, filter: LoadDataFilter = {},): Promise<ApiData> => {
  const res = await rqst<ApiData>(`/movies/${id}/reviews`, {
    method: 'GET',
    params: filter,
  });
  return res;
}

/**
 * Submits a review to the server.           
 * @param {Partial<Review>} data - the data to submit.           
 * @returns {Promise<ApiData>} - the response from the server.           
 */
export const submitReview = async (data: Partial<Review>): Promise<ApiData> => {
  const res = await rqst<ApiData>(`/reviews`, {
    method: 'POST',
    data,
  });
  return res;
};

/**
 * Gets the movies by the given genre id.           
 * @param {string} id - the id of the genre to get movies for           
 * @returns {Promise<ApiData>} - the movies by the given genre id           
 */
export const getMoviesByGenre = async (id: string): Promise<ApiData> => {
  const res = await rqst<ApiData>(`/genres/${id}?includeMovies=true`);
  return res;
};

/**
 * Update the user's favorites list.           
 * @param {string} movieId - the movie id of the movie to update           
 * @param {string} userId - the user id of the user to update           
 * @param {boolean} isFavorite - whether the movie is a favorite or not           
 * @returns {ApiData} - the data returned from the server           
 */
export const updateFavorites = async (data: {
  movieId: string,
  userId: string,
  isFavorite: boolean,
}): Promise<ApiData> => {
  const res = await rqst<ApiData>(`/users/${data.userId}/favorites`, {
    method: 'PATCH',
    data: {
      [data.movieId]: data.isFavorite,
    },
  });
  return res;
};

/**
 * Gets the favorites for the given user.           
 * @param {string} userId - the user's id           
 * @returns {ApiData} - the user's favorites           
 */
export const getFavorites = async (userId: string): Promise<ApiData> => {
  const res = await rqst<ApiData>(`/users/${userId}/favorites`);
  return res;
};

/**
 * Gets the logged in user's data from the API.           
 * @returns {Promise<ApiData>} - The logged in user's data.           
 */
export const getLoggedInUserData = async (): Promise<ApiData> => {
  const res = await rqst<ApiData>(`/users/me`);
  return res;
};
