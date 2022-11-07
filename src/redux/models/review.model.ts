import { Movie } from "./movie.model";
import { User } from "./user.model";

export interface Review {
  _id: string;
  content: string;
  rating: number;
  approved: boolean;
  postedAt: string;
  user: Partial<User>;
  movie: Partial<Movie>;
  [key: string]: any;
}