import React from "react";
import { Card, Text, Loading } from "@grupo10-pos-fiap/design-system";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { MonthlyData } from "@/types/dashboard";
import styles from "./EvolutionWidget.module.css";

interface EvolutionWidgetProps {
  data: MonthlyData[];
  loading?: boolean;
}

function EvolutionWidget({ data, loading = false }: EvolutionWidgetProps) {
  return (
    <Card variant="elevated" color="base" className={styles.card}>
      <div className={styles.header}>
        <Text variant="subtitle" weight="semibold" className={styles.headerTitle}>
          Evolução
        </Text>
      </div>
      {loading ? (
        <Loading text="Carregando..." size="small" />
      ) : (
        <Card.Section className={styles.chartSection}>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
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
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={{ fill: "var(--color-primary)", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card.Section>
      )}
    </Card>
  );
}

export default React.memo(EvolutionWidget);
