import dayjs from "dayjs";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ActorDetailsIntro, ActorImage } from "../../components/actor_thumbnails/ActorDetails";
import { AnimatedContainer, MainContent } from "../../components/layout";
import { Jumbotron } from "../../components/layout/Banner";
import { ThumbnailRow } from "../../components/movie";
import MovieItem from "../../components/movie/MovieItem";
import { SIDEBAR_WIDTH } from "../../constants";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hook";
import { clearCurrentActor, loadActorInfo } from "../../redux/slices";

const ActorPage = () => {
  const { id } = useParams();
  const actor = useAppSelector((state) => state.public.currentActor);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) dispatch(loadActorInfo(id));

    return () => {
      dispatch(clearCurrentActor());
    };
  }, [id, dispatch]);

  return (
    <AnimatedContainer relative>
      <Jumbotron bg="actor" />
      <MainContent>
        <ActorDetailsIntro>
          <ActorImage image={actor?.photo} />
          <div>
            <h1>
              {actor?.firstname} {actor?.lastname}
              <small>
                <span>{actor?.gender === 'M' ? 'Male' : 'Female'} &middot; </span>
                <span>{dayjs().diff(dayjs(actor?.birthdate), 'year')} years old</span>
              </small>
            </h1>
            <h3>Biography</h3>
            <p>{actor?.bio}</p>
          </div>
        </ActorDetailsIntro>
      </MainContent>
      {
        (actor?.movies?.length ?? 0) > 0 && (
          <ThumbnailRow paddingLeft={SIDEBAR_WIDTH} rowTitle="Movies">
            {
              (actor?.movies ?? []).map((movie) => (
                <MovieItem key={movie._id} movie={movie} />
              ))
            }
          </ThumbnailRow>
        )
      }
    </AnimatedContainer>
  );
};

export default ActorPage;