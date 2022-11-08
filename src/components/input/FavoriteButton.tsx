import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hook";
import { doUpdateFavorites } from "../../redux";
import { UIButton } from "../layout";

type FavoriteButtonProps = {
  movieId: string;
};

const FavoriteButton: FC<FavoriteButtonProps> = ({ movieId }) => {
  const { userData } = useAppSelector((state) => state.session);
  const dispatch = useAppDispatch();

  const isFavorite = useMemo(() => {
    if (userData) {
      const favorites = userData.favorites ?? {};
      return favorites[movieId];
    }

    return false;
  }, [userData, movieId]);

  const handleClick = useCallback(async () => {
    if (!userData) {
      toast.error('Please login to add this movie to your favorites.');
      return;
    }

    if (userData.role === 'ADMIN') {
      toast.error('Admins cannot add movies to their favorites.');
      return;
    }

    await dispatch(doUpdateFavorites({ movieId, isFavorite: !isFavorite }));
  }, [dispatch, isFavorite, movieId, userData]);

  if (isFavorite)
    return (
      <UIButton onClick={handleClick}>
        <FontAwesomeIcon icon={solid('remove')} />
        <span>Remove from Favorites</span>
      </UIButton>
    );

  return (
    <UIButton onClick={handleClick}>
      <FontAwesomeIcon icon={solid('add')} />
      <span>Add to Favorites</span>
    </UIButton>
  );
};

export default FavoriteButton;
