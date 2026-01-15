import React, { useCallback, useMemo } from "react";
import {
  Card,
  Button,
  Loading,
  Text,
} from "@grupo10-pos-fiap/design-system";
import { useDashboard } from "@/hooks/useDashboard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  toggleShowSettings,
  setDashboardConfig,
} from "@/store/slices/dashboardSlice";
import { getDashboardConfig } from "@/utils/dashboardStorage";
import BalanceWidget from "@/components/BalanceWidget";
import EvolutionWidget from "@/components/EvolutionWidget";
import IncomeOutcomeWidget from "@/components/IncomeOutcomeWidget";
import WidgetSettings from "@/components/WidgetSettings";
import { WidgetType } from "@/types/dashboard";
import styles from "./Dashboard.module.css";

interface DashboardProps {
  accountId: string | null;
}

function Dashboard({ accountId }: DashboardProps) {
  const dispatch = useAppDispatch();
  const showSettings = useAppSelector((state) => state.dashboard.showSettings);
  const config = useAppSelector((state) => state.dashboard.config);

  const dashboard = useDashboard(accountId);

  const handleConfigChange = useCallback(() => {
    const newConfig = getDashboardConfig();
    dispatch(setDashboardConfig(newConfig));
  }, [dispatch]);

  const visibleWidgets = useMemo(() => {
    return config.widgets
      .filter((w) => w.visible)
      .sort((a, b) => a.order - b.order);
  }, [config]);

  const renderWidget = (widgetId: WidgetType) => {
    switch (widgetId) {
      case "balance":
        return (
          <BalanceWidget
            key="balance"
            balance={dashboard.balance}
            loading={dashboard.loading}
          />
        );
      case "evolution":
        return (
          <EvolutionWidget
            key="evolution"
            data={dashboard.evolutionData}
            loading={dashboard.loading}
          />
        );
      case "incomeOutcome":
        return (
          <IncomeOutcomeWidget
            key="incomeOutcome"
            data={dashboard.incomeOutcomeData}
            loading={dashboard.loading}
          />
        );
      default:
        return null;
    }
  };

  if (!accountId) {
    return (
      <Card variant="elevated" color="white">
        <Card.Section>
          <Text variant="body" color="error">
            Conta não encontrada
          </Text>
        </Card.Section>
      </Card>
    );
  }

  if (dashboard.error) {
    return (
      <Card variant="elevated" color="white">
        <Card.Section>
          <Text variant="body" color="error">
            Erro ao carregar dados: {dashboard.error.message}
          </Text>
        </Card.Section>
      </Card>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <Button
          variant="outlined"
          onClick={() => dispatch(toggleShowSettings())}
          aria-label="Configurações do dashboard"
        >
          <svg
            className={styles.icon}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Personalizar Widgets
        </Button>
      </div>

      {showSettings && (
        <WidgetSettings
          onClose={() => dispatch(toggleShowSettings())}
          onConfigChange={handleConfigChange}
        />
      )}

      {dashboard.loading && visibleWidgets.length === 0 ? (
        <Card variant="elevated" color="white">
          <Card.Section>
            <Loading text="Carregando dashboard..." />
          </Card.Section>
        </Card>
      ) : (
        <div className={styles.widgetsContainer}>
          {visibleWidgets.length === 0 ? (
            <Card variant="elevated" color="white">
              <Card.Section>
                <Text variant="body" color="content-secondary">
                  Nenhum widget visível. Configure os widgets para exibir
                  informações.
                </Text>
              </Card.Section>
            </Card>
          ) : (
            visibleWidgets.map((widget) => renderWidget(widget.id))
          )}
        </div>
      )}
    </div>
  );
}

export default React.memo(Dashboard);
