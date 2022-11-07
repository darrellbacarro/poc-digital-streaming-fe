import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { ChangeEvent, SyntheticEvent, useCallback, useMemo, useRef, useState } from "react";
import { toast } from 'react-hot-toast';
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import logo from '../../assets/images/logo.png';
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hook";
import { doLogin } from "../../redux";
import { validateEmail, ValidationError } from "../../utils/helpers";
import FormInput, { FormFooterStyled, FormStyled } from "../input/FormInput";
import { UIButton } from "../layout";
import { ModalBackdrop } from "./ModalBackdrop";

const ModalStyled = styled(motion.div)`
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #0f0f0f;
  width: 30vw;
  height: min-content;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 16px;
  z-index: 21;
  left: 50%;
  top: 10%;
  margin-left: -15vw;
  box-shadow: 0 0 20px 5px rgba(0, 0, 0, 0.5);
`;

const animation = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.5 },
};

const formVariant = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.05
    }
  },
  exit: { opacity: 0 }
};

const formItemVariant = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const LoginForm = () => {
  const [creds, setCreds] = useState({ email: '', password: '' });
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.session);
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setCreds((creds) => ({ ...creds, [e.target.name]: e.target.value }));
  }, [setCreds]);

  const handleSubmit = useCallback(async (e: SyntheticEvent) => {
    e.preventDefault();
    const { email, password } = creds;
    
    try {
      if (!email) throw new ValidationError("Please enter your email address", "email");
      if (!validateEmail(email)) throw new ValidationError("You entered an invalid email", "email");
      if (!password) throw new ValidationError("Your password is required", "password");

      const ret = await dispatch(doLogin({ email, password })).unwrap();
      if (!ret.success) throw new ValidationError(ret.message, "");

      toast.success("Login successful");
      if (ret.data.user.role === "ADMIN") navigate('/cm');
      else navigate('/');
    } catch (err: any) {
      if (err instanceof ValidationError) {
        toast.error(err.message);

        switch (err.field) {
          case "email":
            emailRef.current?.focus();
            break;
          case "password":
            passRef.current?.focus();
            break;
          default:
            break;
        }

        return;
      }

      toast.error(err.message ?? err);
    }
  }, [creds, dispatch, navigate]);

  if (token) return <Navigate to="/" replace />

  return (
    <FormStyled onSubmit={handleSubmit} variants={formVariant} initial="initial" animate="animate">
       <FormInput
        autoFocus
        ref={emailRef}
        variants={formItemVariant}
        id={'email'}
        label={'Email Address'}
        onChange={handleChange} />
      <FormInput
        ref={passRef}
        variants={formItemVariant}
        id={'password'}
        label={'Password'}
        type='password'
        onChange={handleChange} />
      <UIButton className="single no-margin" variants={formItemVariant}>Log In</UIButton>
      <FormFooterStyled variants={formItemVariant}>
        <span>Don't have an account?</span>
        <Link to="?s">Create Account</Link>
      </FormFooterStyled>
    </FormStyled>
  );
};

const SignUpForm = () => {
  return (
    <FormStyled variants={formVariant} initial="initial" animate="animate">
      <FormInput
        autoFocus
        variants={formItemVariant}
        id={'fullname'}
        label={'Your Fullname'}
        onChange={(e) => {}} />
      <FormInput
        variants={formItemVariant}
        id={'email'}
        label={'Email Address'}
        onChange={(e) => {}} />
      <FormInput
        variants={formItemVariant}
        id={'password'}
        label={'Password'}
        type='password'
        onChange={(e) => {}} />
      <FormInput
        variants={formItemVariant}
        id={'cpassword'}
        label={'Confirm Password'}
        type='password'
        onChange={(e) => {}} />
      <UIButton className="single no-margin" variants={formItemVariant}>Create Account</UIButton>
      <FormFooterStyled variants={formItemVariant}>
        <span>Already have an account?</span>
        <Link to="?l">Log In</Link>
      </FormFooterStyled>
    </FormStyled>
  );
};

const LoginSignUpModal = () => {
  const [sp, setSP] = useSearchParams();

  const handleClose = useCallback(() => {
    if (sp.has('l')) sp.delete('l');
    if (sp.has('s')) sp.delete('s');
    setSP(sp);
  }, [sp, setSP]);

  const mode = useMemo(() => {
    if (sp.has('s')) return "Sign Up";
    return "Log In";
  }, [sp]);

  return (
    <>
      <ModalBackdrop onClick={handleClose} />
      <ModalStyled {...animation}>
        <img src={logo} height={128} alt="Movies Logo" />
        <h2>{ mode }</h2>
        {
          mode === "Log In"
            ? <LoginForm />
            : <SignUpForm />
        }
      </ModalStyled>
    </>
  );
};

export default LoginSignUpModal;