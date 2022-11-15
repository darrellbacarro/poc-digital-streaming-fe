import styled from "@emotion/styled";
import { Link } from 'react-router-dom';
import { HEADER_HEIGHT, SIDEBAR_WIDTH } from "../../constants";
import { SearchContainer } from "../input/CustomSearch";

export const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: hidden;
`;

export const SideBar = styled.div`
  position: absolute;
  height: 100%;
  width: ${SIDEBAR_WIDTH}px;
  background-color: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(10px);
  border-right: 1px rgb(30, 30, 30) solid;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 24px 0;
  padding-top: 8px;
  z-index: 10;
`;

export const SideBarItem = styled(Link)`
  padding: 14px 24px;
  opacity: 0.5;
  display: grid;
  grid-template-columns: 24px 1fr;
  transition: opacity 300ms;
  grid-column-gap: 10px;
  color: white;
  text-decoration: none;

  &:first-of-type {
    margin-top: 16px;
  }

  &:hover {
    cursor: pointer;
    opacity: 0.9;
  }

  &.active {
    opacity: 1;
  }

  & > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }

  &.special {
    color: orange;
    opacity: 1;
  }
`;

type SizedBoxProps = {
  width?: number | string;
  height?: number | string;
};

export const SizedBox = styled.div<SizedBoxProps>`
  flex: ${(props) => props.width || props.height ? 'none' : 1};
  width: ${(props) => props.width || 'auto'};
  height: ${(props) => props.height || 'auto'};
`;

export const ContainerHeader = styled.div`
  position: absolute;
  height: ${HEADER_HEIGHT}px;
  width: calc(100vw - ${SIDEBAR_WIDTH}px);
  left: ${SIDEBAR_WIDTH}px;
  top: 0;
  background-color: transparent;
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
  z-index: 11;
  transition: all 300ms;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;

  &.solid {
    background-color: rgba(0, 0, 0, 0.85);
    box-shadow: 5px 5px 10px 1px rgb(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    z-index: 15;

    & ${SearchContainer} {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
`;

export const UserAvatar = styled.div<{ image: string, size?: number }>`
  width: ${(props) => props.size ?? 28}px;
  height: ${(props) => props.size ?? 28}px;
  background-size: 90%;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${(props) => props.image});
  border-radius: 5px;
  background-color: #000000;
`;

export const UserAvatarContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);

  & > span {
    font-size: 14px;
    font-weight: 600;
  }
`;

export const Content = styled.div`
  width: 100%;
  height: 100%;
  padding-left: ${SIDEBAR_WIDTH + 24}px;
`;

export const HeaderControlsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: stretch;
  gap: 8px;
`;

export const HeaderButton = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background-color: transparent;
  transition: background-color 300ms;
  color: white;
  border-radius: 5px;

  &:hover:not(:disabled) {
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.1);
  }

  &:active {
    background-color: rgba(255, 255, 255, 0.3);
  }

  &:disabled {
    opacity: 0.3;
  }

  &.big {
    width: 48px;
    height: 48px;
  }
`;

export const PublicPageHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  align-self: stretch;
`;