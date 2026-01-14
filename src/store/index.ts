import { configureStore } from "@reduxjs/toolkit";
import type { EnhancedStore } from "@reduxjs/toolkit";
import dashboardReducer from "./slices/dashboardSlice";
import accountReducer from "./slices/accountSlice";

const storeConfig = {
  reducer: {
    dashboard: dashboardReducer,
    account: accountReducer,
  },
} as const;

function createStore(): EnhancedStore {
  return configureStore(storeConfig);
}

export const store: EnhancedStore = createStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
