function parseDate(value?: string | null) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDate(value?: string | null) {
  const date = parseDate(value);

  if (!date) {
    return value ?? "";
  }

  return new Intl.DateTimeFormat("pt-BR").format(date);
}

export function formatDateTime(value?: string | null) {
  const date = parseDate(value);

  if (!date) {
    return value ?? "";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function formatMonthYear(value?: string | null) {
  const date = parseDate(value);

  if (!date) {
    return value ?? "";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(date);
}
