import LocalStorage from "#/infra/local-storage/LocalStorage";

export type SessionRole = "student" | "administrator" | "contributor" | string;

export type SessionUser = {
  id?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  role?: SessionRole;
  createdAt?: string;
};

export const ADMIN_ROLE = "administrator" as const;
export const CONTRIBUTOR_ROLE = "contributor" as const;
export const STUDENT_ROLE = "student" as const;

export function getAccessToken(): string | null {
  return LocalStorage.getAuthToken();
}

export function getCachedUser(): SessionUser | null {
  return LocalStorage.getUser<SessionUser>();
}

/**
 * Sync auth check for route `beforeLoad` guards. Must stay synchronous
 * (localStorage only) so navigation never waits on the network.
 */
export function isAuthenticated(): boolean {
  const token = getAccessToken();
  return token !== null && token !== "";
}

/**
 * Pure role check against an allow-list. Returns `null` when unknown
 * (no cache / legacy cache without role) — callers must let the background
 * `/me` query decide then instead of locking the user out.
 *
 * Pure (no `localStorage` read), so it is safe to call during render.
 * Use {@link hasAnyRole} outside render, {@link useCachedUser} + this
 * inside render to stay hydration-safe.
 */
export function hasAnyRoleIn(
  user: SessionUser | null | undefined,
  ...allowed: SessionRole[]
): boolean | null {
  if (!user || typeof user.role !== "string" || user.role === "") return null;
  return allowed.includes(user.role);
}

/**
 * Cached role check against an allow-list. Reads `localStorage`, so it must
 * NOT run during render (SSR hydration mismatch) — use only in event
 * handlers, `beforeLoad` guards, and other non-render code.
 */
export function hasAnyRole(...allowed: SessionRole[]): boolean | null {
  return hasAnyRoleIn(getCachedUser(), ...allowed);
}
