import {
  combineReducers,
  configureStore,
  PreloadedState
} from "@reduxjs/toolkit";
import type { RenderOptions } from "@testing-library/react";
import { render } from "@testing-library/react";
import React, { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import type { AppStore, RootState } from "../redux";
// As a basic setup, import your same slice reducers
import { adminReducer, publicReducer, sessionReducer } from "../redux/slices";

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
}

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["session"],
};

const reducers = combineReducers({
  session: sessionReducer,
  admin: adminReducer,
  public: publicReducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = configureStore({ reducer: persistedReducer, preloadedState }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// mock responses
export const getMoviesResponse = {
  success: true,
  message: "Movies retrieved successfully!",
  data: {
    total: 79,
    items: [
      {
        id: "6368a3cddcd1a9dc620a3c1b",
        title: "The Suicide Squad",
        poster:
          "https://image.tmdb.org/t/p/original/kb4s0ML0iVZlG6wAKbbs9NAm6X.jpg",
        cost: 185000000,
        release_year: 2021,
        runtime: 132,
        plot: "Supervillains Harley Quinn, Bloodsport, Peacemaker and a collection of nutty cons at Belle Reve prison join the super-secret, super-shady Task Force X as they are dropped off at the remote, enemy-infused island of Corto Maltese.",
        backdrop:
          "https://image.tmdb.org/t/p/original/jlGmlFOcfo8n5tURmhC7YVd4Iyy.jpg",
        genres: [],
        actors: [],
      },
      {
        id: "6368a3cddcd1a9dc620a3c1c",
        title: "Naruto Shippuden the Movie",
        poster:
          "https://image.tmdb.org/t/p/original/vDkct38sSFSWJIATlfJw0l3QOIR.jpg",
        cost: 29000000,
        release_year: 2007,
        runtime: 94,
        plot: "Demons that once almost destroyed the world, are revived by someone. To prevent the world from being destroyed, the demon has to be sealed and the only one who can do it is the shrine maiden Shion from the country of demons, who has two powers; one is sealing demons and the other is predicting the deaths of humans. This time Naruto's mission is to guard Shion, but she predicts Naruto's death. The only way to escape it, is to get away from Shion, which would leave her unguarded, then the demon, whose only goal is to kill Shion will do so, thus meaning the end of the world. Naruto decides to challenge this \"prediction of death.\"",
        backdrop:
          "https://image.tmdb.org/t/p/original/mUC2BS04DlszdqJQ9vz9MFuPiDd.jpg",
        genres: [],
        actors: [],
      },
    ],
  },
};

export const loginUserResponse = {
  success: true,
  message: "Successfully logged in",
  data: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNjgwMWMzMDFhMzc4OTljNWE2ZTMzYSIsImVtYWlsIjoidXNlcjFAZW1haWwuY29tIiwiaWF0IjoxNjY3ODgyMTE4LCJleHAiOjE2Njc5MDM3MTh9.DiiLNEIEiPHAYAyTt6h85jBrBKb0yS3Ly7LGsT76UJU",
    user: {
      id: "636801c301a37899c5a6e33a",
      email: "user1@email.com",
      fullname: "Test User",
      role: "USER",
      approved: true,
      enabled: false,
      favorites: {
        "6368a3cddcd1a9dc620a3c1b": true,
      },
    },
  },
};

export const loginAdminResponse = {
  success: true,
  message: "Successfully logged in",
  data: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNjlkNmNlYmIyNTNlNTYxNzZhNDY2YSIsImVtYWlsIjoiYWRtaW5AZW1haWwuY29tIiwiaWF0IjoxNjY3ODgzNDMzLCJleHAiOjE2Njc5MDUwMzN9.3OLMRePI-eiYYV2LIetWzuNAnnUcwJCz4fu7TGf4lvQ",
    user: {
      id: "6369d6cebb253e56176a466a",
      email: "admin@email.com",
      fullname: "Administrator",
      role: "ADMIN",
      approved: true,
      enabled: true,
    },
  },
};

export const loginErrorResponse = {
  success: false,
  message: "Invalid email or password.",
  data: null,
};
