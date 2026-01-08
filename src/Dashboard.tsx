import React, { useState, useCallback, useMemo } from "react";
import { Card, IconButton, Loading, Text } from "@grupo10-pos-fiap/design-system";
import { useDashboard } from "@/hooks/useDashboard";
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
  const [showSettings, setShowSettings] = useState(false);
  const [configVersion, setConfigVersion] = useState(0);

  const dashboard = useDashboard(accountId);
  const config = useMemo(() => getDashboardConfig(), [configVersion]);

  const handleConfigChange = useCallback(() => {
    setConfigVersion((prev) => prev + 1);
  }, []);

  const visibleWidgets = useMemo(() => {
    return config.widgets.filter((w) => w.visible).sort((a, b) => a.order - b.order);
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
      <Card variant="elevated" color="base">
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
      <Card variant="elevated" color="base">
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
        <IconButton
          icon="Settings"
          variant="transparent"
          size="medium"
          onClick={() => setShowSettings(!showSettings)}
          aria-label="Configurações do dashboard"
        />
      </div>

      {showSettings && (
        <WidgetSettings
          onClose={() => setShowSettings(false)}
          onConfigChange={handleConfigChange}
        />
      )}

      {dashboard.loading && visibleWidgets.length === 0 ? (
        <Card variant="elevated" color="base">
          <Card.Section>
            <Loading text="Carregando dashboard..." size="medium" />
          </Card.Section>
        </Card>
      ) : (
        <div className={styles.widgetsContainer}>
          {visibleWidgets.length === 0 ? (
            <Card variant="elevated" color="base">
              <Card.Section>
                <Text variant="body" color="content-secondary">
                  Nenhum widget visível. Configure os widgets para exibir informações.
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
