import React from "react";
import { Card, Text, Loading } from "@grupo10-pos-fiap/design-system";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { MonthlyIncomeOutcome } from "@/types/dashboard";
import styles from "./IncomeOutcomeWidget.module.css";

interface IncomeOutcomeWidgetProps {
  data: MonthlyIncomeOutcome[];
  loading?: boolean;
}

function IncomeOutcomeWidget({ data, loading = false }: IncomeOutcomeWidgetProps) {
  return (
    <Card variant="elevated" color="base" className={styles.card}>
      <div className={styles.header}>
        <Text variant="subtitle" weight="semibold" className={styles.headerTitle}>
          Entrada Vs Saída
        </Text>
      </div>
      {loading ? (
        <Loading text="Carregando..." size="small" />
      ) : (
        <Card.Section className={styles.chartSection}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-gray200)" />
              <XAxis
                dataKey="month"
                stroke="var(--color-content-secondary)"
                style={{ fontSize: "var(--font-small)" }}
              />
              <YAxis
                stroke="var(--color-content-secondary)"
                style={{ fontSize: "var(--font-small)" }}
                domain={[0, 100]}
              />
              <Bar
                dataKey="entrada"
                fill="#658864"
                name="Entrada"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="saida"
                fill="#e53935"
                name="Saída"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card.Section>
      )}
    </Card>
  );
}

export default React.memo(IncomeOutcomeWidget);
