import { useQuery } from "@tanstack/react-query";
import { fetchStatement, fetchBalance } from "@/api/dashboard.api";
import { processEvolutionData, processIncomeOutcomeData } from "@/utils/dataProcessors";
import { Balance, MonthlyData, MonthlyIncomeOutcome } from "@/types/dashboard";

interface UseDashboardReturn {
  balance: Balance | null;
  evolutionData: MonthlyData[];
  incomeOutcomeData: MonthlyIncomeOutcome[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useDashboard(accountId: string | null): UseDashboardReturn {
  const {
    data: transactions,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dashboard", accountId],
    queryFn: () => (accountId ? fetchStatement(accountId) : Promise.resolve([])),
    enabled: !!accountId,
    staleTime: 30000, // 30 seconds
  });

  const balanceQuery = useQuery({
    queryKey: ["balance", accountId],
    queryFn: () => (accountId ? fetchBalance(accountId) : Promise.resolve(null)),
    enabled: !!accountId,
    staleTime: 30000,
  });

  const balance = balanceQuery.data || null;
  const evolutionData = transactions ? processEvolutionData(transactions) : [];
  const incomeOutcomeData = transactions ? processIncomeOutcomeData(transactions) : [];

  return {
    balance,
    evolutionData,
    incomeOutcomeData,
    loading: isLoading || balanceQuery.isLoading,
    error: (error || balanceQuery.error) as Error | null,
    refetch: () => {
      refetch();
      balanceQuery.refetch();
    },
  };
}
