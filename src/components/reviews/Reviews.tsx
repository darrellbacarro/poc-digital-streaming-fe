import styled from "@emotion/styled";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import {
  FC,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import toast from "react-hot-toast";
import { Rating } from "react-simple-star-rating";
import { RATING_STAR_SIZE } from "../../constants";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hook";
import { Review } from "../../redux/models";
import { doSubmitReview } from "../../redux/slices";
import { getRandomInt } from "../../utils/helpers";
import { UIButton, UserAvatar } from "../layout";

const ReviewsSectionStyled = styled.div`
  display: grid;
  align-self: stretch;
  grid-template-columns: 3fr 2fr;
  column-gap: 48px;
`;

const ReviewsContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-self: stretch;
  margin-top: 16px;
  min-height: 60vh;
`;

const ReviewRatingStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  opacity: 0.6;
`;

const ReviewAuthorStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const ReviewHeaderStyled = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
`;

const ReviewStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  & > p {
    font-size: 14px;
    line-height: 20px;
    margin: 6px 0;
    opacity: 0.7;
    text-align: justify;
    padding: 16px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
  }
`;

const ReviewInputStyled = styled.textarea`
  border: 0;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 12px;
  font-size: 14px;
  transition: background-color 300ms;
  color: #fff;
  font-family: "Netflix Sans", sans-serif;
  resize: none;

  &:focus {
    outline: none;
    background-color: rgba(255, 255, 255, 0.3);

    &::placeholder {
      color: rgba(0, 0, 0, 0.4);
    }
  }
`;

const ReviewForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;

  & h3 {
    margin-bottom: 8px;
  }

  & ${UIButton} {
    align-self: flex-end;
  }

  & i {
    opacity: 0.5;
    font-size: 16px;
  }
`;

const ReviewEmptyStyled = styled.div`
  opacity: 0.3;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  height: 30vh;
`;

const ReviewEmpty = () => {
  return (
    <ReviewEmptyStyled>
      <FontAwesomeIcon size="5x" icon={solid("comment-dots")} />
      <h3>No reviews yet</h3>
    </ReviewEmptyStyled>
  );
};

const ReviewRow: FC<{ review: Review }> = ({ review }) => {
  return (
    <ReviewStyled>
      <ReviewHeaderStyled>
        <ReviewAuthorStyled>
          <UserAvatar
            image={
              review.user?.photo ??
              "https://avatars.dicebear.com/v2/jdenticon/8f4522be6be9ff5677d60f40781399c0.svg"
            }
          />
          <strong>{review.user?.fullname ?? ""}</strong>
        </ReviewAuthorStyled>
        <ReviewRatingStyled>
          <FontAwesomeIcon icon={solid("star")} />
          <span>
            {review.rating} / {RATING_STAR_SIZE}
          </span>
          <span>&middot;</span>
          <span>{dayjs(review.postedAt).format("MMMM D, YYYY h:mm A")}</span>
        </ReviewRatingStyled>
      </ReviewHeaderStyled>
      <p>{review.content}</p>
    </ReviewStyled>
  );
};

type ReviewsProps = {
  setFormRef: (ref: HTMLFormElement | null) => void;
};

export const Reviews: FC<ReviewsProps> = ({ setFormRef }) => {
  const {
    session: { token, userData },
    public: {
      currentMovieReviews: { items = [] },
      currentMovie,
    },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const formRef = useRef<HTMLFormElement>(null);

  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");

  const loggedIn = useMemo(() => {
    return !!token;
  }, [token]);

  const userHasReview = useMemo(() => {
    if (!loggedIn) return false;
    return items.some((review) => review.user?.userId === userData?.id);
  }, [items, userData, loggedIn]);

  const reviewFormWarning = useMemo(() => {
    if (!userData) return "You must be logged in to write a review";
    if (userData?.role === "ADMIN") return "Admins cannot write reviews";
    if (userHasReview) return "You have already written a review";

    return null;
  }, [userData, userHasReview]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      try {
        if (!content)
          throw new Error("Your review is empty. Please write something.");
        if (!rating) throw new Error("Please rate the movie.");

        const payload: Partial<Review> = {
          content,
          rating,
          user: {
            userId: userData?.id,
            fullname: userData?.fullname,
            photo: userData?.photo,
          },
          movie: {
            movieId: currentMovie?.id,
            title: currentMovie?.title,
            poster: currentMovie?.poster,
          },
        };

        const ret = await dispatch(doSubmitReview(payload)).unwrap();

        if (!ret.success) throw new Error(ret.message);

        toast.success(ret.message);
        setRating(0);
        setContent("");
      } catch (error: any) {
        toast.error(error?.message ?? e);
      }
    },
    [rating, content, userData, currentMovie, dispatch]
  );

  useEffect(() => {
    setFormRef(formRef.current);
  }, [formRef.current]);

  return (
    <ReviewsSectionStyled>
      <ReviewsContainerStyled>
        {items.length > 0 ? (
          items.map((review) => <ReviewRow key={review._id} review={review} />)
        ) : (
          <ReviewEmpty />
        )}
      </ReviewsContainerStyled>
      <ReviewForm ref={formRef} onSubmit={handleSubmit}>
        <h3>Write a review</h3>
        {!reviewFormWarning ? (
          <>
            <div>
              <span>Your Rating: </span>
              <Rating
                initialValue={rating}
                onClick={(r) => setRating(r)}
                iconsCount={RATING_STAR_SIZE}
                allowFraction
                size={24}
              />
            </div>
            {process.env.NODE_ENV === "test" && (
              <button
                data-testid="rate-btn"
                onClick={() => setRating(getRandomInt(0, 5))}
              >
                Set Rating
              </button>
            )}
            <ReviewInputStyled
              data-testid="review-input"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={7}
              placeholder="Write your review here..."
            />
            <UIButton data-testid="submit-review-btn">Submit Review</UIButton>
          </>
        ) : (
          <i>{reviewFormWarning}</i>
        )}
      </ReviewForm>
    </ReviewsSectionStyled>
  );
};
