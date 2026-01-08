export interface Transaction {
  id: string;
  accountId: string;
  type: "Credit" | "Debit";
  value: number;
  date: string;
  from?: string;
  to?: string;
  anexo?: string;
  urlAnexo?: string;
}

export interface Balance {
  value: number;
  yield?: number;
  yieldPercentage?: number;
}

export interface StatementResponse {
  message: string;
  result: {
    transactions: Transaction[];
    pagination?: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
}

export type WidgetType = "balance" | "evolution" | "incomeOutcome";

export interface WidgetConfig {
  id: WidgetType;
  visible: boolean;
  order: number;
}

export interface DashboardConfig {
  widgets: WidgetConfig[];
}

export interface MonthlyData {
  month: string;
  value: number;
}

export interface MonthlyIncomeOutcome {
  month: string;
  entrada: number;
  saida: number;
}
