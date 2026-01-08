import { Transaction, Balance, StatementResponse } from "@/types/dashboard";
import { fetchApi } from "@/utils/apiClient";
import { calculateBalance } from "@/utils/balanceCalculator";

export async function fetchStatement(accountId: string): Promise<Transaction[]> {
  try {
    const response = await fetchApi(`/account/${accountId}/statement?pageSize=1000`);
    const data: StatementResponse = await response.json();

    const transactions = data.result.transactions || [];
    return transactions.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Erro ao buscar extrato");
  }
}

export async function fetchBalance(accountId: string): Promise<Balance> {
  try {
    const transactions = await fetchStatement(accountId);
    return calculateBalance(transactions);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Erro ao buscar saldo");
  }
}
