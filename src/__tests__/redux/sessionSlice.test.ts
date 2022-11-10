import {
  doLogin,
  doLogout,
  sessionReducer as reducer
} from "../../redux/slices";

describe("session reducer", () => {
  test("should return the initial state", () => {
    expect(
      reducer({ token: null, userData: null }, { type: undefined })
    ).toEqual({
      token: null,
      userData: null,
    });
  });

  test("should update state on login dispatch", () => {
    const payload = {
      success: true,
      data: {
        token: "token",
        user: {
          id: "6369d6cebb253e56176a466a",
          email: "admin@email.com",
          fullname: "Administrator",
          role: "ADMIN",
          approved: true,
          enabled: true,
        },
      },
      message: "Login successful",
    };

    const action = doLogin.fulfilled(payload, "requestId", {
      email: "",
      password: "",
    });

    expect(reducer({}, action)).toEqual({
      token: payload.data.token,
      userData: payload.data.user,
    });
  });

  test("should clear state on logout dispatch", () => {
    const action = doLogout.fulfilled(null, "requestId", undefined);

    expect(reducer({}, action)).toEqual({
      token: null,
      userData: null,
    });
  });
});
