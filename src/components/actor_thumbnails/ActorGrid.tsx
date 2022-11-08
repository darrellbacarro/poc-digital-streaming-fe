import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Actor, MovieActorInfo } from "../../redux/models";

const ActorGridStyled = styled(motion.div)`
  display: grid;
  align-self: stretch;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-auto-rows: 245px;
  column-gap: 16px;
  row-gap: 24px;
  padding: 16px 0;
`;

type ActorImageStyledProps = {
  image?: string;
};

const ActorImageStyled = styled.div<ActorImageStyledProps>`
  flex: 1;
  align-self: stretch;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.1);
  background-size: cover;
  background-image: url(${(props) => props.image});
`;

const ActorThumbnailStyled = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  opacity: 0.9;
  transition: opacity 300ms, transform 500ms;

  &:hover {
    cursor: pointer;
    opacity: 1;
    transform: scale(1.05);
  }

  & > span {
    display: -webkit-box;
    font-size: 14px;
    text-align: center;
    overflow: hidden;
    max-width: 100%;
    height: 35px;
    box-sizing: border-box;
    padding: 0 6px;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`;

type ActorThumbnailProps = {
  image?: string;
  name?: string;
  actorId?: string;
};

const thumbnailVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const ActorThumbnail: FC<ActorThumbnailProps> = ({ image, name, actorId }) => {
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    navigate(`/actors/${actorId}`);
  }, [actorId, navigate]);

  return (
    <ActorThumbnailStyled
      variants={thumbnailVariants}
      onClick={handleClick}
      whileHover={{ scale: 1.1, transition: { duration: 0.1 } }}
      whileTap={{ scale: 0.9 }}
    >
      <ActorImageStyled image={image} />
      <span>{name ?? "Actor Name"}</span>
    </ActorThumbnailStyled>
  );
};

type ActorGridProps = {
  actors: Partial<(Actor & MovieActorInfo)>[];
};

const gridVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.01 },
  },
};

export const ActorGrid: FC<ActorGridProps> = ({ actors = [] }) => {
  return (
    <ActorGridStyled
      key={actors.length === 0 ? 'actor-grid' : actors[0].id ?? actors[0].actorId}
      variants={gridVariants}
      initial="hidden"
      animate="visible">
      {actors.map((actor) => (
        <ActorThumbnail
          key={actor.id ?? actor.actorId}
          image={actor.photo}
          name={actor.name ?? [actor.firstname, actor.lastname].join(" ")}
          actorId={actor.id ?? actor.actorId}
        />
      ))}
    </ActorGridStyled>
  );
};
