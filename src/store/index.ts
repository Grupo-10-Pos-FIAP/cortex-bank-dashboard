import { configureStore, type EnhancedStore } from "@reduxjs/toolkit";
import dashboardReducer from "./slices/dashboardSlice";

const storeConfig = {
  reducer: {
    dashboard: dashboardReducer,
  },
} as const;

function createStore(): EnhancedStore {
  return configureStore(storeConfig);
}

export const store: EnhancedStore = createStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
