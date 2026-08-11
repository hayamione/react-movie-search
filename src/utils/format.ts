export function formatRuntime(runtime?: number): string | undefined {
  if (runtime === undefined || runtime === null || runtime <= 0) {
    return undefined;
  }
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

export function formatCurrency(value?: number): string | undefined {
  if (value === undefined || value === null || value <= 0) {
    return undefined;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value?: number): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  return value.toLocaleString('en-US');
}

export function formatPopularity(value?: number): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  return value.toLocaleString('en-US', { maximumFractionDigits: 1 });
}

export function formatReleaseDate(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatLanguageCode(code?: string): string | undefined {
  if (!code) {
    return undefined;
  }
  return code.toUpperCase();
}