import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Toaster } from 'react-hot-toast';
import { Router } from 'react-router-dom';
import { SignUpForm } from "../components/modals/LoginSignUpModal";
import { renderWithProviders } from "../utils/test-utils";

describe("Sign Up Form", () => {
  const history = createMemoryHistory();

  test("should render the sign up form", async () => {
    renderWithProviders(
      <Router location={history.location} navigator={history}>
        <SignUpForm />
      </Router>
    );

    expect(screen.getByTestId('signup-btn')).toBeInTheDocument();
    expect(screen.getByTestId('fullname')).toBeInTheDocument();
    expect(screen.getByTestId('email')).toBeInTheDocument();
    expect(screen.getByTestId('password')).toBeInTheDocument();
    expect(screen.getByTestId('cpassword')).toBeInTheDocument();
  });

  test("should validate sign up inputs", async () => {
    renderWithProviders(
      <Router location={history.location} navigator={history}>
        <Toaster />
        <SignUpForm />
      </Router>
    );

    const btn = screen.getByTestId('signup-btn');
    const fullname = screen.getByTestId('fullname');
    const email = screen.getByTestId('email');
    const password = screen.getByTestId('password');
    const cpassword = screen.getByTestId('cpassword');

    userEvent.click(btn);
    expect(screen.getByText(/Please enter your fullname/)).toBeInTheDocument();
    expect(fullname).toHaveFocus();

    userEvent.type(fullname, 'John Doe');
    userEvent.click(btn);
    expect(screen.getByText(/Please enter your email address/)).toBeInTheDocument();
    expect(email).toHaveFocus();

    userEvent.type(email, 'john');
    userEvent.click(btn);
    expect(screen.getByText(/You entered an invalid email/)).toBeInTheDocument();
    expect(email).toHaveFocus();

    userEvent.type(email, 'doe@email.com');
    userEvent.click(btn);
    expect(screen.getByText(/Your password is required/)).toBeInTheDocument();
    expect(password).toHaveFocus();
    
    userEvent.type(password, '123');
    userEvent.click(btn);
    expect(screen.getByText(/Please confirm your password/)).toBeInTheDocument();
    expect(cpassword).toHaveFocus();
  });
});
