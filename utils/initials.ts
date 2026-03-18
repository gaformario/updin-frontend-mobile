export function getInitials(nome: string) {
  if (!nome) return "?";

  return nome
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase();
}
