import { Movie } from "./movie.model";

export interface Genre {
  id: string;
  title: string;
  gradient: string;
  movies?: Partial<Movie>[];
  [key: string]: any;
}