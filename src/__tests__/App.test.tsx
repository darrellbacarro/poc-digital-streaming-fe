import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { renderWithProviders, withRouter } from "../utils/test-utils";

describe("App", () => {
  test("should render the page for Guest User", () => {
    renderWithProviders(
      withRouter(App, { route: '/', path: '/' })
    );

    expect(screen.getByRole('button', { name: /Log In/i })).toBeInTheDocument();
  });

  test("should open a login form dialog on Log In button click", async () => {
    renderWithProviders(
      withRouter(App, { route: '/', path: '/' })
    );

    await act(async () => {
      userEvent.click(screen.getByRole('button', { name: /Log In/i }));
    });

    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByTestId('login-btn')).toBeInTheDocument();
  });

  test("should open a login form dialog on ?l route", async () => {
    renderWithProviders(
      withRouter(App, { route: '/?l', path: '/' })
    );

    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByTestId('login-btn')).toBeInTheDocument();
  });

  test("should open a signup form dialog on ?s route", async () => {
    renderWithProviders(
      withRouter(App, { route: '/?s', path: '/' })
    );

    expect(screen.getByTestId('signup-btn')).toBeInTheDocument();
    expect(screen.getByTestId('fullname')).toBeInTheDocument();
    expect(screen.getByTestId('email')).toBeInTheDocument();
    expect(screen.getByTestId('password')).toBeInTheDocument();
    expect(screen.getByTestId('cpassword')).toBeInTheDocument();
  });
});
