function compact(value: number, unit: string): string {
  return `${(value < 100 ? value.toFixed(1) : value.toFixed(0)).replace(/\.0$/, '')}${unit}`;
}

export function formatCount(n: number): string {
  if (n >= 1_000_000) return compact(n / 1_000_000, 'M');
  if (n >= 1_000) return compact(n / 1_000, 'K');

  return String(n);
}