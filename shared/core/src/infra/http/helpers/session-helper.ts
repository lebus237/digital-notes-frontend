import axios from "#/infra/http/axios-client";
import LocalStorage from "#/infra/local-storage/LocalStorage";

export type SessionPayload = {
  accessToken?: string;
  /** Legacy field name; backend now returns `accessToken`. */
  token?: string;
  refreshToken?: string;
  context?: unknown;
  user?: unknown;
};

export const authSuccess = (props: SessionPayload) => {
  const accessToken = props.accessToken ?? props.token;

  if (typeof window !== "undefined") {
    if (accessToken) LocalStorage.setAuthToken(accessToken);
    if (props.refreshToken) {
      LocalStorage.setRefreshToken(props.refreshToken);
    }
    if (props.context !== undefined) {
      LocalStorage.setAppContext((props.context as object) ?? {});
    }
    if (props.user !== undefined && props.user !== null) {
      LocalStorage.setUser(props.user as object);
    }
  }

  if (accessToken) {
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    axios.defaults.headers.Authorization = `Bearer ${accessToken}`;
  }
};

export const clearSession = () => {
  delete axios.defaults.headers.Authorization;
  if (axios.defaults.headers?.common) {
    delete (axios.defaults.headers.common as Record<string, unknown>)
      .Authorization;
  }

  LocalStorage.clearAll();
};

export const logout = (redirectTo = "/login") => {
  clearSession();

  if (typeof window !== "undefined") {
    window.location.replace(redirectTo);
  }
};
