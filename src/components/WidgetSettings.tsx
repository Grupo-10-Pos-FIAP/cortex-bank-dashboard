import React, { useState, useRef } from "react";
import {
  Card,
  Text,
  Button,
  IconButton,
} from "@grupo10-pos-fiap/design-system";
import { WidgetType, WidgetConfig } from "@/types/dashboard";
import {
  getDashboardConfig,
  toggleWidgetVisibility,
  updateWidgetOrder,
} from "@/utils/dashboardStorage";
import styles from "./WidgetSettings.module.css";

interface WidgetSettingsProps {
  onClose: () => void;
  onConfigChange: () => void;
}

const WIDGET_LABELS: Record<WidgetType, string> = {
  balance: "Saldo",
  evolution: "Evolução",
  incomeOutcome: "Entrada vs Saída",
};

function WidgetSettings({ onClose, onConfigChange }: WidgetSettingsProps) {
  const [config, setConfig] = useState(getDashboardConfig());
  const [draggedWidget, setDraggedWidget] = useState<WidgetType | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchWidgetId, setTouchWidgetId] = useState<WidgetType | null>(null);
  const [draggedOverWidget, setDraggedOverWidget] = useState<WidgetType | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const widgetRefs = useRef<Map<WidgetType, HTMLDivElement>>(new Map());

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

    reorderWidgets(draggedWidget, targetWidgetId);
  };

  const reorderWidgets = (sourceWidgetId: WidgetType, targetWidgetId: WidgetType) => {
    if (sourceWidgetId === targetWidgetId) {
      setDraggedWidget(null);
      setTouchWidgetId(null);
      setDraggedOverWidget(null);
      return;
    }

    const draggedIndex = config.widgets.findIndex(
      (w) => w.id === sourceWidgetId
    );
    const targetIndex = config.widgets.findIndex(
      (w) => w.id === targetWidgetId
    );

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
    setTouchWidgetId(null);
    setDraggedOverWidget(null);
    onConfigChange();
  };

  const handleTouchStart = (e: React.TouchEvent, widgetId: WidgetType) => {
    // Ignora toques que começam em botões ou elementos interativos
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('[role="button"]') ||
      target.tagName === 'BUTTON'
    ) {
      return;
    }

    const touch = e.touches[0];
    setTouchStartY(touch.clientY);
    setTouchWidgetId(widgetId);
    setDraggedWidget(widgetId);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === null || touchWidgetId === null) return;

    const touch = e.touches[0];
    const currentY = touch.clientY;
    const deltaY = Math.abs(currentY - touchStartY);

    // Só inicia o arrasto se o movimento for significativo (mais de 10px)
    if (deltaY > 10) {
      setIsDragging(true);
      e.preventDefault(); // Previne scroll durante o arrasto
    } else {
      return; // Ainda não é um arrasto, apenas um toque
    }

    // Encontra qual widget está sendo tocado baseado na posição Y
    let targetWidget: WidgetType | null = null;
    let minDistance = Infinity;

    // Itera pelos widgets na ordem atual
    const orderedWidgets = [...config.widgets].sort((a, b) => a.order - b.order);
    
    for (const widget of orderedWidgets) {
      const element = widgetRefs.current.get(widget.id);
      if (!element) continue;

      const rect = element.getBoundingClientRect();
      
      // Verifica se o toque está dentro dos limites verticais do elemento
      if (currentY >= rect.top && currentY <= rect.bottom) {
        targetWidget = widget.id;
        break;
      }

      // Calcula a distância do centro do elemento para encontrar o mais próximo
      const centerY = rect.top + rect.height / 2;
      const distance = Math.abs(currentY - centerY);
      
      if (distance < minDistance) {
        minDistance = distance;
        targetWidget = widget.id;
      }
    }

    // Se encontrou um widget alvo diferente do que está sendo arrastado
    if (targetWidget && targetWidget !== touchWidgetId) {
      setDraggedOverWidget(targetWidget);
    } else if (!targetWidget) {
      setDraggedOverWidget(null);
    }
  };

  const handleTouchEnd = () => {
    // Só reordena se realmente houve um arrasto
    if (isDragging && touchWidgetId && draggedOverWidget) {
      reorderWidgets(touchWidgetId, draggedOverWidget);
    } else {
      setDraggedWidget(null);
      setTouchWidgetId(null);
      setDraggedOverWidget(null);
    }
    setTouchStartY(null);
    setIsDragging(false);
  };

  return (
    <Card variant="elevated" color="white" className={styles.card}>
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
          {config.widgets.map((widget) => {
            const isWidgetDragging = draggedWidget === widget.id;
            const isDragOver = draggedOverWidget === widget.id || 
              (draggedWidget && draggedWidget !== widget.id && !touchWidgetId);
            
            return (
              <div
                key={widget.id}
                ref={(el) => {
                  if (el) {
                    widgetRefs.current.set(widget.id, el);
                  } else {
                    widgetRefs.current.delete(widget.id);
                  }
                }}
                className={`${styles.widgetItem} ${
                  isWidgetDragging ? styles.dragging : ""
                } ${isDragOver ? styles.dragOver : ""}`}
                draggable
                onDragStart={() => handleDragStart(widget.id)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(widget.id)}
                onTouchStart={(e) => handleTouchStart(e, widget.id)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
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
            );
          })}
        </div>
        <div className={styles.actions}>
          <Button variant="primary" onClick={onClose} width="90px">
            Concluir
          </Button>
        </div>
      </Card.Section>
    </Card>
  );
}

export default React.memo(WidgetSettings);
