import { combineReducers, configureStore, PreloadedState } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { adminReducer, publicReducer, sessionReducer } from './slices';

const reducers = combineReducers({
  session: sessionReducer,
  admin: adminReducer,
  public: publicReducer
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['session'],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: persistedReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  })
}

export type RootState = ReturnType<typeof persistedReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];

export * from './slices/session.slice';
