import styled from "@emotion/styled";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { motion } from "framer-motion";
import { FC } from "react";
import { Link } from "react-router-dom";

const IconNavLinkStyled = styled(motion(Link))`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  box-sizing: border-box;
  position: relative;
  color: rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  margin: 6px;

  &:first-of-type {
    margin-top: 24px;
  }

  &::after {
    content: attr(data-label);
    position: absolute;
    left: 100%;
    font-size: 14px;
    display: block;
    background-color: rgba(0, 0, 0, 0.8);
    border-radius: 5px;
    visibility: hidden;
    opacity: 0;
    color: white;
    padding: 6px 10px;
    border: 1px rgba(255, 255, 255, 0.2) solid;
    white-space: nowrap;
  }

  &, &::after {
    transition: all 500ms;
  }

  &:hover {
    cursor: pointer;
    color: white;
  }

  &:hover::after {
    visibility: visible;
    opacity: 1;
    transform: translateX(10px);
  }

  &.active {
    color: white;
    background-color: rgba(255, 255, 255, 0.1);
  }

  &.special {
    color: orange;
    opacity: 1;
  }
`;

type IconNavLinkProps = {
  icon: IconDefinition;
  label: string;
  to: string;
  active?: boolean;
  className?: string;
};

export const IconNavLink: FC<IconNavLinkProps> = ({ to, label, icon, active = false, className }) => {
  return (
    <IconNavLinkStyled data-testid={label} to={to} className={className ?? clsx({ active })} data-label={label}>
      <FontAwesomeIcon size="lg" icon={icon} />
    </IconNavLinkStyled>
  );
};