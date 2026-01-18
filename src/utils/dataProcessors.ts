import {
  Transaction,
  MonthlyData,
  MonthlyIncomeOutcome,
} from "@/types/dashboard";
import { formatMonth } from "./formatters";

const MONTHS_TO_SHOW = 6;
const NORMALIZATION_OFFSET = 10000;
const NORMALIZATION_DIVISOR = 20000;
const MAX_PERCENTAGE = 100;

export function processEvolutionData(
  transactions: Transaction[]
): MonthlyData[] {
  const now = new Date();
  const sixMonthsAgo = new Date(
    now.getFullYear(),
    now.getMonth() - (MONTHS_TO_SHOW - 1),
    1
  );

  const monthlyBalances = new Map<string, number>();
  let runningBalance = 0;

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

  for (let i = MONTHS_TO_SHOW - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    const balance = monthlyBalances.get(monthKey);

    if (balance !== undefined) {
      lastBalance = balance;
    }

    const normalizedValue = Math.max(
      0,
      Math.min(
        MAX_PERCENTAGE,
        ((lastBalance + NORMALIZATION_OFFSET) / NORMALIZATION_DIVISOR) *
          MAX_PERCENTAGE
      )
    );

    result.push({
      month: formatMonth(date.toISOString()),
      value: normalizedValue,
    });
  }

  return result;
}

export function processIncomeOutcomeData(
  transactions: Transaction[]
): MonthlyIncomeOutcome[] {
  const now = new Date();
  const sixMonthsAgo = new Date(
    now.getFullYear(),
    now.getMonth() - (MONTHS_TO_SHOW - 1),
    1
  );

  const monthlyMap = new Map<string, { entrada: number; saida: number }>();

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

  let maxEntrada = 0;
  let maxSaida = 0;
  monthlyMap.forEach((data) => {
    maxEntrada = Math.max(maxEntrada, data.entrada);
    maxSaida = Math.max(maxSaida, data.saida);
  });
  const maxValue = Math.max(maxEntrada, maxSaida, 1);

  const result: MonthlyIncomeOutcome[] = [];
  for (let i = MONTHS_TO_SHOW - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    const data = monthlyMap.get(monthKey) || { entrada: 0, saida: 0 };

    result.push({
      month: formatMonth(date.toISOString()),
      entrada: Math.max(
        0,
        Math.min(MAX_PERCENTAGE, (data.entrada / maxValue) * MAX_PERCENTAGE)
      ),
      saida: Math.max(
        0,
        Math.min(MAX_PERCENTAGE, (data.saida / maxValue) * MAX_PERCENTAGE)
      ),
    });
  }

  return result;
}
