import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Toaster } from 'react-hot-toast';
import { Router } from 'react-router-dom';
import { LoginForm } from "../components/modals/LoginSignUpModal";
import * as API from '../utils/api';
import { loginAdminResponse, loginErrorResponse, renderWithProviders } from "../utils/test-utils";

jest.mock("axios");
jest.mock("framer-motion", () => ({
  ...jest.requireActual("framer-motion"),
  useReducedMotion: () => true,
}));
describe("Login Form", () => {
  afterAll(() => jest.resetAllMocks());
  const history = createMemoryHistory();

  test("should render the login form", async () => {
    renderWithProviders(
      <Router location={history.location} navigator={history}>
        <LoginForm />
      </Router>
    );

    expect(screen.getByTestId('login-btn')).toBeInTheDocument();
    expect(screen.getByTestId('email')).toBeInTheDocument();
    expect(screen.getByTestId('password')).toBeInTheDocument();
  });

  test("should validate login inputs", async () => {
    renderWithProviders(
      <Router location={history.location} navigator={history}>
        <Toaster />
        <LoginForm />
      </Router>
    );

    const btn = screen.getByTestId('login-btn');
    const email = screen.getByTestId('email');
    const password = screen.getByTestId('password');

    jest.spyOn<typeof API, any>(API, 'login').mockResolvedValueOnce(loginAdminResponse);

    userEvent.click(btn);
    expect(screen.getByText(/Please enter your email address/)).toBeInTheDocument();
    expect(email).toHaveFocus();
    
    userEvent.type(email, 'test');
    userEvent.click(btn);
    expect(screen.getByText(/You entered an invalid email/)).toBeInTheDocument();
    expect(email).toHaveFocus();
    
    userEvent.type(email, 'test@email.com');
    userEvent.click(btn);
    expect(screen.getByText(/Your password is required/)).toBeInTheDocument();
    expect(password).toHaveFocus();
  });

  test("should login successfully for valid user", async () => {
    renderWithProviders(
      <Router location={history.location} navigator={history}>
        <Toaster />
        <LoginForm />
      </Router>
    );

    const btn = screen.getByTestId('login-btn');
    const email = screen.getByTestId('email');
    const password = screen.getByTestId('password');

    jest.spyOn<typeof API, any>(API, 'login').mockResolvedValueOnce(loginAdminResponse);

    await act(async () => {
      userEvent.type(email, 'test@email.com');
      userEvent.type(password, '123');
      userEvent.click(btn);
    });

    expect(screen.getByText(/Login successful/)).toBeInTheDocument();
  });

  test("should show error message on invalid login credentials", async () => {
    renderWithProviders(
      <Router location={history.location} navigator={history}>
        <Toaster />
        <LoginForm />
      </Router>
    );

    const btn = screen.getByTestId('login-btn');
    const email = screen.getByTestId('email');
    const password = screen.getByTestId('password');

    jest.spyOn<typeof API, any>(API, 'login').mockResolvedValueOnce(loginErrorResponse);

    await act(async () => {
      userEvent.type(email, 'invalid@email.com');
      userEvent.type(password, '123');
      userEvent.click(btn);
    });

    expect(screen.getByText(loginErrorResponse.message)).toBeInTheDocument();
  });
});
