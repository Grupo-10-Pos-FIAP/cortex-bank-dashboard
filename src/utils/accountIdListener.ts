export type AccountIdListenerOptions = {
  onChange: (accountId: string | null) => void;
};

export function addAccountIdListeners(options: AccountIdListenerOptions) {
  const { onChange } = options;

  const handleAccountIdChange = (event: Event) => {
    const customEvent = event as CustomEvent<{ accountId: string }>;
    const newAccountId =
      customEvent.detail?.accountId ||
      localStorage.getItem("accountId") ||
      null;
    onChange(newAccountId);
  };

  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === "accountId") {
      const newAccountId =
        e.newValue || localStorage.getItem("accountId") || null;
      onChange(newAccountId);
    }
  };

  window.addEventListener("accountIdChanged", handleAccountIdChange);
  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("accountIdChanged", handleAccountIdChange);
    window.removeEventListener("storage", handleStorageChange);
  };
}
