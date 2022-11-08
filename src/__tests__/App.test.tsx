import { screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import App from '../App';
import { renderWithProviders } from "../utils/test-utils";

describe("App", () => {
  const history = createMemoryHistory();
  test("should render the page for Guest User", () => {
    renderWithProviders(
      <Router location={history.location} navigator={history}>
        <App />
      </Router>
    );

    expect(screen.getByText(/Guest/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log In or Sign Up/i })).toBeInTheDocument();
  });

  test("should open a login form dialog on ?l route", async () => {
    history.replace('/?l');
    renderWithProviders(
      <Router location={history.location} navigator={history}>
        <App />
      </Router>
    );

    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByTestId('login-btn')).toBeInTheDocument();
  });

  test("should open a signup form dialog on ?s route", async () => {
    history.replace('/?s');
    renderWithProviders(
      <Router location={history.location} navigator={history}>
        <App />
      </Router>
    );

    expect(screen.getByTestId('signup-btn')).toBeInTheDocument();
    expect(screen.getByTestId('fullname')).toBeInTheDocument();
    expect(screen.getByTestId('email')).toBeInTheDocument();
    expect(screen.getByTestId('password')).toBeInTheDocument();
    expect(screen.getByTestId('cpassword')).toBeInTheDocument();
  });
});
