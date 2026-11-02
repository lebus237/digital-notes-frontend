import { IconNotes } from "@tabler/icons-react";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import {
  ADMIN_ROLE,
  AccessDenied,
  AppShellLayout,
  CONTRIBUTOR_ROLE,
  hasAnyRoleIn,
  isAuthenticated,
  useCachedUser,
  useMe,
  type SidebarConfig,
} from "@digitalnotes/core";
import { NotesProvider } from "@/entities/note";
import { ThemeSwitcher } from "@/features/switch-theme";

const sidebarConfig: SidebarConfig = {
  items: [
    {
      id: "notes",
      label: "Notes",
      icon: IconNotes,
      keywords: ["notes"],
      children: [
        { id: "my-notes", label: "My notes", to: "/" },
        { id: "submit", label: "Submit", to: "/submit" },
      ],
    },
  ],
};

export const Route = createFileRoute("/_app")({
  /**
   * Sync guard only: localStorage read, no network, so navigation and the
   * route loaders start immediately. Wrong-role accounts pass here on purpose
   * and get the inline `AccessDenied` below once `/me` resolves.
   */
  beforeLoad: ({ location }) => {
    if (typeof window === "undefined") return;
    if (!isAuthenticated()) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
  },
  component: ContributorLayout,
});

function ContributorLayout() {
  const me = useMe();

  // Hydration-safe: cached user arrives after mount, so the server HTML and
  // the first client render agree (fallback profile, shell content).
  const cachedUser = useCachedUser();
  const serverRole = me.data?.user?.role;
  const serverDenied =
    typeof serverRole === "string" &&
    serverRole !== CONTRIBUTOR_ROLE &&
    serverRole !== ADMIN_ROLE;
  const denied =
    hasAnyRoleIn(cachedUser, ADMIN_ROLE, CONTRIBUTOR_ROLE) === false ||
    serverDenied;
  const serverUser = me.data?.user;
  const user = serverUser ?? cachedUser;
  const profileName =
    user?.fullName || user?.email || user?.phoneNumber || "Contributor";
  const profileMeta = denied
    ? "Not authorized"
    : user?.email && user.email !== profileName
      ? user.email
      : user
        ? "Signed in"
        : "Not signed in";

  return (
    <NotesProvider>
      <AppShellLayout
        sidebarConfig={sidebarConfig}
        brandName="DigitalNotes"
        brandMeta="Contributor"
        profileName={profileName}
        profileMeta={profileMeta}
        headerEnd={<ThemeSwitcher />}
      >
        {denied ? (
          <AccessDenied message="This account does not have access to the contributor area. Sign in with a contributor account." />
        ) : (
          <Outlet />
        )}
      </AppShellLayout>
    </NotesProvider>
  );
}
