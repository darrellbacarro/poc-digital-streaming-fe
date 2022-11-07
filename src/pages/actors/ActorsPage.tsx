import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useState } from "react";
import { ActorGrid } from "../../components/actor_thumbnails/ActorGrid";
import { AnimatedContainer, HeaderButton, MainContent, PublicPageHeaderContainer, UIButtonBar } from "../../components/layout";
import { Jumbotron } from "../../components/layout/Banner";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hook";
import { publicLoadActors } from "../../redux/slices";

const ActorsPage = () => {
  const { items, total } = useAppSelector((state) => state.public.actors);
  const [page, setPage] = useState(1);
  const dispatch = useAppDispatch();

  const totalPages = useMemo(() => {
    return Math.ceil(total / 20);
  }, [total]);

  useEffect(() => {
    dispatch(publicLoadActors({ page, limit: 20 }));
  }, [page]);

  return (
    <AnimatedContainer relative>
      <Jumbotron bg="actor" />
      <MainContent>
        <PublicPageHeaderContainer>
          <h1>Actors</h1>
          <UIButtonBar>
            <HeaderButton
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="big">
              <FontAwesomeIcon size="2x" icon={solid('chevron-left')} />
            </HeaderButton>
            <HeaderButton
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
              className="big">
              <FontAwesomeIcon size="2x" icon={solid('chevron-right')} />
            </HeaderButton>
          </UIButtonBar>
        </PublicPageHeaderContainer>
        <ActorGrid actors={items} />
      </MainContent>
    </AnimatedContainer>
  );
};

export default ActorsPage;