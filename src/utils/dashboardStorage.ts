import { DashboardConfig, WidgetType } from "@/types/dashboard";

const DASHBOARD_CONFIG_KEY = "dashboardConfig";

const DEFAULT_WIDGETS: DashboardConfig = {
  widgets: [
    { id: "balance", visible: true, order: 0 },
    { id: "evolution", visible: true, order: 1 },
    { id: "incomeOutcome", visible: true, order: 2 },
  ],
};

const cloneConfig = (config: DashboardConfig): DashboardConfig => ({
  widgets: config.widgets.map((widget) => ({ ...widget })),
});

export function getDashboardConfig(): DashboardConfig {
  if (typeof window === "undefined" || !window.localStorage) {
    return DEFAULT_WIDGETS;
  }

  try {
    const stored = localStorage.getItem(DASHBOARD_CONFIG_KEY);
    if (stored) {
      const config = JSON.parse(stored) as DashboardConfig;
      const widgetIds = new Set(config.widgets.map((w) => w.id));
      DEFAULT_WIDGETS.widgets.forEach((defaultWidget) => {
        if (!widgetIds.has(defaultWidget.id)) {
          config.widgets.push({
            ...defaultWidget,
            order: config.widgets.length,
          });
        }
      });
      // Sort by order
      config.widgets.sort((a, b) => a.order - b.order);
      return cloneConfig(config);
    }
  } catch (error) {
    console.error("Erro ao ler configuração do dashboard:", error);
  }

  return cloneConfig(DEFAULT_WIDGETS);
}

export function saveDashboardConfig(config: DashboardConfig): void {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  try {
    localStorage.setItem(DASHBOARD_CONFIG_KEY, JSON.stringify(config));
  } catch (error) {
    console.error("Erro ao salvar configuração do dashboard:", error);
  }
}

export function toggleWidgetVisibility(widgetId: WidgetType): DashboardConfig {
  const config = cloneConfig(getDashboardConfig());
  const widget = config.widgets.find((w) => w.id === widgetId);
  if (widget) {
    widget.visible = !widget.visible;
    saveDashboardConfig(config);
  }
  return config;
}

export function updateWidgetOrder(
  widgets: Array<{ id: WidgetType; order: number }>
): DashboardConfig {
  const config = cloneConfig(getDashboardConfig());
  widgets.forEach(({ id, order }) => {
    const widget = config.widgets.find((w) => w.id === id);
    if (widget) {
      widget.order = order;
    }
  });
  config.widgets.sort((a, b) => a.order - b.order);
  saveDashboardConfig(config);
  return config;
}
