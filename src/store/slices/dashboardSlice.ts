import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WidgetConfig, DashboardConfig } from "@/types/dashboard";
import {
  getDashboardConfig,
  saveDashboardConfig,
} from "@/utils/dashboardStorage";

export interface DashboardState {
  config: DashboardConfig;
  showSettings: boolean;
}

const initialState: DashboardState = {
  config: getDashboardConfig(),
  showSettings: false,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashboardConfig: (state, action: PayloadAction<DashboardConfig>) => {
      state.config = action.payload;
      saveDashboardConfig(action.payload);
    },
    toggleWidgetVisibility: (state, action: PayloadAction<string>) => {
      const widget = state.config.widgets.find((w) => w.id === action.payload);
      if (widget) {
        widget.visible = !widget.visible;
        saveDashboardConfig(state.config);
      }
    },
    updateWidgetOrder: (
      state,
      action: PayloadAction<Array<{ id: string; order: number }>>
    ) => {
      action.payload.forEach(({ id, order }) => {
        const widget = state.config.widgets.find((w) => w.id === id);
        if (widget) {
          widget.order = order;
        }
      });
      state.config.widgets.sort((a, b) => a.order - b.order);
      saveDashboardConfig(state.config);
    },
    setShowSettings: (state, action: PayloadAction<boolean>) => {
      state.showSettings = action.payload;
    },
    toggleShowSettings: (state) => {
      state.showSettings = !state.showSettings;
    },
  },
});

export const {
  setDashboardConfig,
  toggleWidgetVisibility,
  updateWidgetOrder,
  setShowSettings,
  toggleShowSettings,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
