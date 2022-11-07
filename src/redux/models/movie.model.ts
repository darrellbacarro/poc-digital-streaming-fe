import { Genre } from "./genre.model";
import { User } from "./user.model";

export interface MovieActorInfo {
  actorId: string;
  name: string;
  photo: string;
}

export interface MovieReview {
  _id: string;
  content: string;
  rating: number;
  approved: boolean;
  postedAt: string;
  user: Partial<User>;
}

export interface Movie {
  id: string;
  title: string;
  poster: string;
  cost: string;
  release_year: number;
  rating: number;
  runtime: number;
  plot: string;
  backdrop: string;
  actors: MovieActorInfo[];
  reviews?: MovieReview[];
  genres?: Genre[];
  [key: string]: any;
}