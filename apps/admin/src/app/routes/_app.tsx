import { IconBook, IconBuilding, IconUsers } from "@tabler/icons-react";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import {
  ADMIN_ROLE,
  AccessDenied,
  AppShellLayout,
  hasAnyRoleIn,
  isAuthenticated,
  useCachedUser,
  useMe,
  type SidebarConfig,
} from "@digitalnotes/core";
import { ThemeSwitcher } from "@/features/switch-theme";

const sidebarConfig: SidebarConfig = {
  items: [
    {
      id: "organisation",
      label: "Organisation",
      to: "/organisation",
      icon: IconBuilding,
      keywords: ["organisation", "universities", "faculties"],
    },
    {
      id: "courses",
      label: "Courses",
      to: "/courses",
      icon: IconBook,
      keywords: ["courses", "catalog"],
    },
    {
      id: "employees",
      label: "Employees",
      to: "/employees",
      icon: IconUsers,
      keywords: ["employees", "staff"],
    },
  ],
};

export const Route = createFileRoute("/_app")({
  /**
   * Sync guard only: localStorage read, no network, so navigation and the
   * route loaders start immediately. Wrong-role accounts pass here on purpose
   * and get the inline `AccessDenied` below once `/me` resolves — this keeps
   * the redirect loop-free and the view fast.
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
  component: AdminLayout,
});

function AdminLayout() {
  const me = useMe();

  // Hydration-safe: cached user arrives after mount, so the server HTML and
  // the first client render agree (fallback profile, shell content).
  const cachedUser = useCachedUser();
  const serverRole = me.data?.user?.role;
  const denied =
    hasAnyRoleIn(cachedUser, ADMIN_ROLE) === false ||
    (typeof serverRole === "string" && serverRole !== ADMIN_ROLE);
  const displayName =
    me.data?.user?.fullName ??
    me.data?.user?.email ??
    cachedUser?.fullName ??
    cachedUser?.email ??
    "Administrator";

  return (
    <AppShellLayout
      sidebarConfig={sidebarConfig}
      brandName="DigitalNotes"
      brandMeta="Administration"
      profileName={displayName}
      profileMeta={denied ? "Not authorized" : "Review queue"}
      headerEnd={<ThemeSwitcher />}
    >
      {denied ? <AccessDenied /> : <Outlet />}
    </AppShellLayout>
  );
}
