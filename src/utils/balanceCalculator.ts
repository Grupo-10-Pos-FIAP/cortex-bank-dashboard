import { Transaction, Balance } from "@/types/dashboard";

const DEFAULT_YIELD_PERCENTAGE = 3;

export function calculateBalance(
  transactions: Transaction[],
  yieldPercentage?: number
): Balance {
  const total = transactions.reduce(
    (sum, transaction) => sum + transaction.value,
    0
  );

  return {
    value: total,
    yieldPercentage: yieldPercentage ?? DEFAULT_YIELD_PERCENTAGE,
  };
}
