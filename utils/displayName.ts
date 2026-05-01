import type { AuthUser } from '@/store/authSlice';

export function resolveDisplayName(
  user: AuthUser | null,
  override: string | null,
): string {
  const o = override?.trim();
  if (o) return o;
  if (!user) return '';
  const full = [user.firstName, user.lastName].filter(Boolean).join(' ');
  return full || user.username || '';
}
