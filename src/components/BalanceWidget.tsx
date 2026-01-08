import React, { useState } from "react";
import { Card, Text, IconButton, Loading } from "@grupo10-pos-fiap/design-system";
import { Balance } from "@/types/dashboard";
import { formatCurrency } from "@/utils/formatters";
import styles from "./BalanceWidget.module.css";

interface BalanceWidgetProps {
  balance: Balance | null;
  loading?: boolean;
}

function BalanceWidget({ balance, loading = false }: BalanceWidgetProps) {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const displayValue = isVisible && balance ? formatCurrency(balance.value) : "••••••";
  const yieldPercentage = balance?.yieldPercentage;

  return (
    <Card variant="elevated" color="base" className={styles.card}>
      <div className={styles.header}>
        <Text variant="subtitle" weight="semibold" className={styles.headerTitle}>
          Saldo
        </Text>
        <IconButton
          icon={isVisible ? "Eye" : "EyeOff"}
          variant="transparent"
          size="medium"
          onClick={() => setIsVisible(!isVisible)}
          aria-label={isVisible ? "Ocultar saldo" : "Mostrar saldo"}
        />
      </div>
      {loading ? (
        <Loading text="Carregando..." size="small" />
      ) : (
        <Card.Section>
          <Text variant="h2" weight="bold" className={styles.balance}>
            {displayValue}
          </Text>
          {yieldPercentage !== null && yieldPercentage !== undefined && (
            <Text variant="body" color="success" className={styles.yield}>
              Rendeu {yieldPercentage}% desde o mês passado
            </Text>
          )}
        </Card.Section>
      )}
    </Card>
  );
}

export default React.memo(BalanceWidget);
