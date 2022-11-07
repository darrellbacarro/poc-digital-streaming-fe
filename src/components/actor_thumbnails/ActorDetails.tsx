import styled from "@emotion/styled";

type ActorImageProps = {
  image?: string;
};

export const ActorImage = styled.div<ActorImageProps>`
  background-image: url(${(props) => props.image});
  background-size: cover;
  background-position: center;
  min-width: 200px;
  height: 300px;
  border-radius: 5px;
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.5);
`;

export const ActorDetailsIntro = styled.div`
  display: flex;
  flex-direction: row;
  gap: 36px;

  & p {
    font-size: 14px;
  }

  & h1 > small {
    display: block;
    font-weight: 400;
    font-size: 16px;
    opacity: 0.7;
    margin-top: 8px;
  }
`;