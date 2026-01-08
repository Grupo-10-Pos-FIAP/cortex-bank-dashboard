import { Transaction, Balance } from "@/types/dashboard";

export function calculateBalance(transactions: Transaction[], yieldPercentage?: number): Balance {
  const total = transactions.reduce((sum, transaction) => {
    return sum + transaction.value;
  }, 0);

  return {
    value: total,
    yieldPercentage: yieldPercentage ?? 3,
  };
}
