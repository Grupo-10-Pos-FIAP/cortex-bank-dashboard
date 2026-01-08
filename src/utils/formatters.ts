export function formatCurrency(value: number): string {
  if (typeof value !== "number" || isNaN(value)) {
    return "R$ 0,00";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatValue(value: number): string {
  if (typeof value !== "number" || isNaN(value)) {
    return "0,00";
  }

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatMonth(date: string): string {
  const d = new Date(date);
  const monthNames = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  return monthNames[d.getMonth()];
}
