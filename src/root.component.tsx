import React, { useState, useEffect, useCallback } from "react";
import { Provider } from "react-redux";
import { Card, Text, Loading, Button } from "@grupo10-pos-fiap/design-system";
import { getAccountId } from "@/utils/accountStorage";
import { QueryProvider } from "@/providers/QueryProvider";
import { store } from "@/store";
import Dashboard from "./Dashboard";
import "./styles/tokens.css";
import styles from "./root.component.module.css";

interface RootProps {
  name?: string;
}

export default function Root(_props: RootProps) {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [loadingAccount, setLoadingAccount] = useState<boolean>(true);

  const loadAccountId = useCallback(() => {
    setLoadingAccount(true);
    setTimeout(() => {
      const storedAccountId = getAccountId();
      setAccountId(storedAccountId);
      setLoadingAccount(false);
    }, 0);
  }, []);

  useEffect(() => {
    loadAccountId();
  }, [loadAccountId]);

  const handleRefresh = useCallback(() => {
    loadAccountId();
  }, [loadAccountId]);

  if (loadingAccount) {
    return (
      <Provider store={store}>
        <QueryProvider>
          <div className={styles.container}>
            <Loading text="Carregando..." size="medium" />
          </div>
        </QueryProvider>
      </Provider>
    );
  }

  if (!accountId) {
    return (
      <Provider store={store}>
        <QueryProvider>
          <div className={styles.container}>
            <Card variant="elevated" color="base">
              <Card.Section>
                <div
                  style={{ textAlign: "center", padding: "var(--spacing-xl)" }}
                >
                  <Text
                    variant="subtitle"
                    weight="semibold"
                    color="error"
                    style={{ marginBottom: "var(--spacing-md)" }}
                  >
                    Conta não identificada
                  </Text>
                  <Text
                    variant="body"
                    color="gray600"
                    style={{ marginBottom: "var(--spacing-lg)" }}
                  >
                    Não foi possível identificar a conta. Por favor, verifique
                    se o accountId está armazenado no localStorage.
                  </Text>
                  <Button
                    variant="primary"
                    onClick={handleRefresh}
                    width="auto"
                  >
                    Atualizar Tela
                  </Button>
                </div>
              </Card.Section>
            </Card>
          </div>
        </QueryProvider>
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <QueryProvider>
        <div className={styles.container}>
          <Dashboard accountId={accountId} />
        </div>
      </QueryProvider>
    </Provider>
  );
}
