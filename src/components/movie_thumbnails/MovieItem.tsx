import { FC } from "react";
import { Movie } from "../../redux/models";
import { timeConvert } from "../../utils/helpers";
import { ThumbnailDetails } from "./ThumbnailDetails";
import { ThumbnailItem } from "./ThumbnailItem";

type MovieItemProps = {
  movie: Partial<Movie>;
};

const MovieItem: FC<MovieItemProps> = ({ movie }) => {
  return (
    <ThumbnailItem pathId={movie._id ?? movie.id} image={movie.backdrop ?? ''}>
      <ThumbnailDetails>
        <div>
          <h3>{movie.title}</h3>
          <div className="sub_details">
            <span>{movie.release_year}</span>&middot;
            <span>{timeConvert(movie.runtime ?? 0)}</span>
          </div>
          <p>
          { movie.plot }
          </p>
        </div>
      </ThumbnailDetails>
    </ThumbnailItem>
  );
}

export default MovieItem;