import { Loader } from "@mantine/core";
import { useEffect } from "react";
import { clearSession } from "#/infra/http/helpers/session-helper";

const DEFAULT_REDIRECT = "/login";

/**
 * Shared logout page for all apps (admin, contributor, app).
 *
 * Role: clear stored localStorage context (`app-context`) and credentials
 * (`app-token`, `app-refresh-token`, `app-user`), drop the in-memory
 * axios `Authorization` header, then redirect to the login page.
 *
 * Intended usage — one thin route per app:
 *
 * ```tsx
 * import { createFileRoute } from '@tanstack/react-router'
 * import { LogoutView } from '@digitalnotes/core'
 *
 * export const Route = createFileRoute('/logout')({
 *   component: LogoutView,
 * })
 * ```
 */
export function LogoutView({
  redirectTo = DEFAULT_REDIRECT,
  redirectDelayMs = 400,
  title = "Signing you out…",
  message = "Clearing your session. You will be redirected to sign in.",
}: Readonly<{
  redirectTo?: string;
  redirectDelayMs?: number;
  title?: string;
  message?: string;
}>) {
  useEffect(() => {
    // clearSession is idempotent, so running twice under StrictMode is harmless.
    // Always (re)arm the timer so the redirect fires even after a
    // StrictMode mount-unmount-mount cycle clears the first one.
    clearSession();

    const timer = window.setTimeout(() => {
      window.location.replace(redirectTo);
    }, redirectDelayMs);

    return () => window.clearTimeout(timer);
  }, [redirectTo, redirectDelayMs]);

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "24rem" }}>
        <Loader
          size="lg"
          aria-label="Signing out"
          style={{ marginBottom: "1rem" }}
        />
        <h1 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>{title}</h1>
        {/*<p style={{ opacity: 0.7 }}>{message}</p>*/}
      </div>
    </main>
  );
}

export default LogoutView;
