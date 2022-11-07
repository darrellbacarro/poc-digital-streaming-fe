import { Movie } from "./movie.model";

export interface Actor {
  id: string;
  firstname: string;
  lastname: string;
  gender: string;
  birthdate: string;
  photo: string;
  bio: string;
  movies?: Partial<Movie>[];
  totalMovies?: number;
  [key: string]: any;
}