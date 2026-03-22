export function normalizeShareEmail(email: string | null | undefined) {
  return email?.trim().toLowerCase() ?? null;
}
