import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "@digitalnotes/core";
import { LoginView } from "@/pages/login";

type LoginSearch = {
  redirect?: string;
};

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  beforeLoad: ({ search }) => {
    if (typeof window === "undefined") return;
    // Already signed in: skip the form. Role is enforced by `/_app`.
    if (isAuthenticated()) {
      throw redirect({ to: (search as LoginSearch).redirect ?? "/" });
    }
  },
  component: LoginRouteComponent,
});

function LoginRouteComponent() {
  const search = Route.useSearch();
  return <LoginView redirectTo={search.redirect ?? "/"} />;
}
