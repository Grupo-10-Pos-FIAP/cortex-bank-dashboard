import React, { useState, useEffect, useCallback } from "react";
import { Provider } from "react-redux";
import { Card, Text, Loading, Button } from "@grupo10-pos-fiap/design-system";
import { getAccountId } from "@/utils/accountStorage";
import { QueryProvider } from "@/providers/QueryProvider";
import { store } from "@/store";
import Dashboard from "./Dashboard";
import "./styles/tokens.css";
import styles from "./root.component.module.css";
import InvalidAccountCard from "./components/InvalidAccountCard";

export interface RootProps {
  name?: string;
}

export default function Root(_props: RootProps) {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [loadingAccount, setLoadingAccount] = useState<boolean>(true);

  const loadAccountId = useCallback(() => {
    setLoadingAccount(true);
    const storedAccountId = getAccountId();
    setAccountId((prev) =>
      prev !== storedAccountId
        ? storedAccountId
        : storedAccountId === null
        ? null
        : `${storedAccountId}`
    );
    setLoadingAccount(false);
  }, []);

  useEffect(() => {
    loadAccountId();
  }, [loadAccountId]);

  useEffect(() => {
    const handleAccountIdChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ accountId: string }>;
      const newAccountId = customEvent.detail?.accountId || getAccountId();
      if (newAccountId) {
        setAccountId((currentId) => {
          if (currentId !== newAccountId) {
            setLoadingAccount(false);
            return newAccountId;
          }
          return currentId;
        });
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "accountId") {
        const newAccountId = e.newValue || getAccountId();
        if (newAccountId) {
          setAccountId((currentId) => {
            if (currentId !== newAccountId) {
              setLoadingAccount(false);
              return newAccountId;
            }
            return currentId;
          });
        }
      }
    };

    window.addEventListener("accountIdChanged", handleAccountIdChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("accountIdChanged", handleAccountIdChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleRefreshAccount = useCallback(() => {
    window.location.reload();
  }, []);

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
          <InvalidAccountCard handleClick={handleRefreshAccount} />
        </QueryProvider>
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <QueryProvider>
        <div className={styles.container}>
          <Dashboard
            accountId={accountId}
            onRefreshAccount={handleRefreshAccount}
          />
        </div>
      </QueryProvider>
    </Provider>
  );
}
