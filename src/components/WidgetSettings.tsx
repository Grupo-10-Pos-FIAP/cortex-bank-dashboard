import React, { useState } from "react";
import { Card, Text, Button, IconButton } from "@grupo10-pos-fiap/design-system";
import { WidgetType, WidgetConfig } from "@/types/dashboard";
import { getDashboardConfig, toggleWidgetVisibility, updateWidgetOrder } from "@/utils/dashboardStorage";
import styles from "./WidgetSettings.module.css";

interface WidgetSettingsProps {
  onClose: () => void;
  onConfigChange: () => void;
}

const WIDGET_LABELS: Record<WidgetType, string> = {
  balance: "Saldo",
  evolution: "Evolução",
  incomeOutcome: "Entrada Vs Saída",
};

function WidgetSettings({ onClose, onConfigChange }: WidgetSettingsProps) {
  const [config, setConfig] = useState(getDashboardConfig());
  const [draggedWidget, setDraggedWidget] = useState<WidgetType | null>(null);

  const handleToggleVisibility = (widgetId: WidgetType) => {
    const newConfig = toggleWidgetVisibility(widgetId);
    setConfig(newConfig);
    onConfigChange();
  };

  const handleDragStart = (widgetId: WidgetType) => {
    setDraggedWidget(widgetId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetWidgetId: WidgetType) => {
    if (!draggedWidget || draggedWidget === targetWidgetId) {
      setDraggedWidget(null);
      return;
    }

    const draggedIndex = config.widgets.findIndex((w) => w.id === draggedWidget);
    const targetIndex = config.widgets.findIndex((w) => w.id === targetWidgetId);

    const newWidgets = [...config.widgets];
    const [removed] = newWidgets.splice(draggedIndex, 1);
    newWidgets.splice(targetIndex, 0, removed);

    const updatedWidgets = newWidgets.map((widget, index) => ({
      id: widget.id,
      order: index,
    }));

    const newConfig = updateWidgetOrder(updatedWidgets);
    setConfig(newConfig);
    setDraggedWidget(null);
    onConfigChange();
  };

  return (
    <Card variant="elevated" color="base" className={styles.card}>
      <div className={styles.header}>
        <Text variant="subtitle" weight="semibold">
          Personalizar Widgets
        </Text>
        <IconButton
          icon="X"
          variant="transparent"
          size="medium"
          onClick={onClose}
          aria-label="Fechar configurações"
        />
      </div>
      <Card.Section>
        <Text variant="body" className={styles.description}>
          Arraste para reordenar ou clique no ícone de olho para mostrar/ocultar
        </Text>
        <div className={styles.widgetList}>
          {config.widgets.map((widget) => (
            <div
              key={widget.id}
              className={styles.widgetItem}
              draggable
              onDragStart={() => handleDragStart(widget.id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(widget.id)}
            >
              <div className={styles.widgetInfo}>
                <Text variant="body" weight="medium">
                  {WIDGET_LABELS[widget.id]}
                </Text>
              </div>
              <IconButton
                icon={widget.visible ? "Eye" : "EyeOff"}
                variant="transparent"
                size="small"
                onClick={() => handleToggleVisibility(widget.id)}
                aria-label={widget.visible ? "Ocultar" : "Mostrar"}
              />
            </div>
          ))}
        </div>
        <div className={styles.actions}>
          <Button variant="primary" onClick={onClose} width="auto">
            Concluir
          </Button>
        </div>
      </Card.Section>
    </Card>
  );
}

export default React.memo(WidgetSettings);
