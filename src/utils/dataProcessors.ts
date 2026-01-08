import { Transaction, MonthlyData, MonthlyIncomeOutcome } from "@/types/dashboard";
import { formatMonth } from "./formatters";

export function processEvolutionData(transactions: Transaction[]): MonthlyData[] {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  // Calculate cumulative balance for each month
  const monthlyBalances = new Map<string, number>();
  let runningBalance = 0;

  // Sort transactions by date
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  sortedTransactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);
    if (transactionDate >= sixMonthsAgo) {
      runningBalance += transaction.value;
      const monthKey = `${transactionDate.getFullYear()}-${transactionDate.getMonth()}`;
      monthlyBalances.set(monthKey, runningBalance);
    }
  });

  const result: MonthlyData[] = [];
  let lastBalance = 0;
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    const balance = monthlyBalances.get(monthKey);
    
    // Use the last known balance for the month, or carry forward
    if (balance !== undefined) {
      lastBalance = balance;
    }
    
    // Normalize to 0-100 scale based on the range of balances
    // Assuming balance can range from -10000 to 10000, normalize to 0-100
    const normalizedValue = Math.max(0, Math.min(100, ((lastBalance + 10000) / 20000) * 100));
    
    result.push({
      month: formatMonth(date.toISOString()),
      value: normalizedValue,
    });
  }

  return result;
}

export function processIncomeOutcomeData(transactions: Transaction[]): MonthlyIncomeOutcome[] {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const monthlyMap = new Map<
    string,
    { entrada: number; saida: number }
  >();

  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);
    if (transactionDate >= sixMonthsAgo) {
      const monthKey = `${transactionDate.getFullYear()}-${transactionDate.getMonth()}`;
      const current = monthlyMap.get(monthKey) || { entrada: 0, saida: 0 };

      if (transaction.type === "Credit") {
        current.entrada += Math.abs(transaction.value);
      } else {
        current.saida += Math.abs(transaction.value);
      }

      monthlyMap.set(monthKey, current);
    }
  });

  // Find max values for normalization
  let maxEntrada = 0;
  let maxSaida = 0;
  monthlyMap.forEach((data) => {
    maxEntrada = Math.max(maxEntrada, data.entrada);
    maxSaida = Math.max(maxSaida, data.saida);
  });
  const maxValue = Math.max(maxEntrada, maxSaida, 1); // Avoid division by zero

  const result: MonthlyIncomeOutcome[] = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    const data = monthlyMap.get(monthKey) || { entrada: 0, saida: 0 };
    
    // Normalize to 0-100 scale
    result.push({
      month: formatMonth(date.toISOString()),
      entrada: Math.max(0, Math.min(100, (data.entrada / maxValue) * 100)),
      saida: Math.max(0, Math.min(100, (data.saida / maxValue) * 100)),
    });
  }

  return result;
}
