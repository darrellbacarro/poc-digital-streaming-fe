import styled from "@emotion/styled";
import type { Variants } from 'framer-motion';
import { motion } from "framer-motion";
import type { ChangeEvent, HTMLInputTypeAttribute } from 'react';
import { forwardRef } from "react";
import { UIButton } from "../layout";

export const FormStyled = styled(motion.form)`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  width: 100%;
  box-sizing: border-box;
  padding: 0 16px;
  gap: 24px;
  padding-bottom: 36px;

  & > ${UIButton} {
    margin-top: 10px;
  }
`;

export const FormFooterStyled = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  margin-top: 12px;

  & > a {
    &:link {
      text-decoration: none;
    }
    
    &, &:visited, &:active {
      color: orange !important;
    }
  }
`;

type FormInputProps = {
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  id: string;
  label?: string;
  autoFocus?: boolean;
  variants?: Variants;
};

const FormInputStyled = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-self: stretch;
  width: 100%;

  &:focus-within {
    & > label {
      opacity: 1;
    }
  }

  & > label {
    font-weight: 300;
    font-size: 14px;
    margin-left: 4px;
    opacity: 0.6;
  }

  & > input {
    border: 0;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    padding: 10px;
    font-size: 14px;
    color: white;
    transition: background-color 300ms;

    &:focus {
      outline: none;
      background-color: rgba(255, 255, 255, 0.3);
    }

    &[type='password'] {
      letter-spacing: 3px;
      font-weight: 700;
    }
  }
`;

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({
  type = 'text',
  placeholder = '',
  onChange,
  id,
  label,
  autoFocus,
  variants,
}, ref) => {
  return (
    <FormInputStyled variants={variants}>
      { !!label && <label htmlFor={id}>{ label }</label> }
      <input
        autoFocus={autoFocus}
        ref={ref}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        key={id}
        id={id}
        name={id}
      />
    </FormInputStyled>
  );
});

export default FormInput;