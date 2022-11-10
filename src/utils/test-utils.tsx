import {
  PreloadedState
} from "@reduxjs/toolkit";
import type { RenderOptions } from "@testing-library/react";
import { render } from "@testing-library/react";
import React, { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { PublicLayout } from "../components/ui";

import { AppStore, RootState, setupStore } from "../redux";

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>
  store?: AppStore
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export const withRouter = (Component: any, options: { [key: string]: any, isPublic?: boolean, }, props?: { [key: string]: any }) => {
  const { path, route, isPublic = false } = options;

  if (!isPublic)
    return (
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route
            path={ path || route || '/' }
            element={ <Component {...props} /> }
          />
        </Routes>
      </MemoryRouter>
    );

  return (
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path='/' element={<PublicLayout />}>
          <Route path={path} element={<Component {...props} />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};