import styled from '@emotion/styled';

export const ThumbnailDetails = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  background-image: linear-gradient(rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.9) 100%);
  border-radius: 3px;
  overflow: hidden;

  & > * {
    transform: translateY(75px);
    transition: all 500ms;
  }

  & > div {
    position: absolute;
    bottom: 0;
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: flex-end;
    color: white;
    padding: 10px;
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.9);

    & div.sub_details {
      font-size: 12px;
      display: flex;
      opacity: 0.8;
      gap: 8px;
      margin-top: 4px;
    }

    & h3 {
      margin: 0;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    & p {
      display: -webkit-box;
      margin-bottom: 16px;
      font-size: 12px;
      max-width: 100%;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;
