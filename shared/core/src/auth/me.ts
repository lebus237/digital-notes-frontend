import LocalStorage from "#/infra/local-storage/LocalStorage";
import { getServerMessage } from "#/infra/http/api-client";
import { callAction } from "#/infra/http/helpers/action-helpers";
import type { SessionUser } from "./session";

export type MeResponse = {
  user: SessionUser;
  context?: unknown;
};

/** Auth endpoints are global (`/api/*`), shared by every app. */
const meAction = callAction("/api/me", "GET");

/**
 * Background session validation. On success the cached `app-user` is
 * refreshed so sync `beforeLoad` guards see the role on next navigation.
 * 401s are handled globally by the axios interceptor (refresh → logout).
 */
export async function fetchMe(): Promise<MeResponse> {
  const body = await meAction();
  const data = (body?.data ?? body) as MeResponse | undefined;

  if (!data?.user) {
    throw new Error(
      getServerMessage(
        { response: { data: body } },
        "Your session has expired. Please sign in again.",
      ),
    );
  }

  if (typeof window !== "undefined") {
    LocalStorage.setUser({
      id: data.user.id,
      fullName: data.user.fullName,
      email: data.user.email,
      phoneNumber: data.user.phoneNumber,
      role: data.user.role,
    });
  }

  return data;
}
