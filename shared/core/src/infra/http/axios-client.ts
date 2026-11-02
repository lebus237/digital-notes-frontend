import axios, { type AxiosResponse } from "axios";
import LocalStorage from "#/infra/local-storage/LocalStorage";
import { authSuccess } from "#/infra/http/helpers/session-helper";
import { getApiEndpoint } from "#/lib/utils/runtime-config";

const AxiosInstance = axios;
export const getIsOk = (res: AxiosResponse<any>) =>
  [200, 202, 201, 204, 203].includes(res.status);

type QueuedRequest = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let failedQueue: QueuedRequest[] = [];
let isRefreshing = false;

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error || !token) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/** Requests that carry their own credentials and must never trigger a refresh. */
const AUTH_API_PATHS = [
  "/api/login",
  "/api/register",
  "/api/refresh",
  "/api/forgot-password",
  "/api/reset-password",
];

const AUTH_PAGE_PATHS = [
  "/login",
  "/logout",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/company/create",
  "/invitation",
];

const isAuthApiRequest = (url?: string): boolean =>
  !!url && AUTH_API_PATHS.some((path) => url.includes(path));

const isRefreshRequest = (url?: string): boolean =>
  !!url && url.includes("/api/refresh");

const isAuthPage = (pathname: string): boolean =>
  AUTH_PAGE_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

const redirectToLogout = () => {
  if (typeof window !== "undefined" && !isAuthPage(window.location.pathname)) {
    window.location.href = "/logout";
  }
};

AxiosInstance.interceptors.request.use((config) => {
  // Resolve baseURL per request so import order / SSR can't leave it empty.
  // getApiEndpoint() returns '' on the server or when no env is set -> keep relative URL then.
  const base = getApiEndpoint();
  if (base && !config.baseURL) {
    config.baseURL = base;
  }
  // Refresh auth header per request so login/logout takes effect without reload.
  try {
    const token = LocalStorage.getAuthToken();
    if (token && !config.headers?.Authorization) {
      config.headers = config.headers ?? ({} as any);
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  } catch {
    // ignore (SSR)
  }
  return config;
});

async function refreshSession(): Promise<{
  accessToken: string;
  refreshToken?: string;
}> {
  const refreshToken = LocalStorage.getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  const base = getApiEndpoint();
  // Use the bare axios instance to avoid re-entering this interceptor.
  const { data } = await axios.post(
    `${base}/api/refresh`,
    { refreshToken },
    { headers: { "Content-Type": "application/json" } },
  );

  const session = (data as { data?: Record<string, unknown> })?.data ?? data;
  const accessToken =
    (session as { accessToken?: unknown }).accessToken ??
    (session as { token?: unknown }).token;
  const nextRefresh = (session as { refreshToken?: unknown }).refreshToken;

  if (typeof accessToken !== "string" || accessToken === "") {
    throw new Error("Refresh failed");
  }

  return {
    accessToken,
    refreshToken: typeof nextRefresh === "string" ? nextRefresh : undefined,
  };
}

AxiosInstance.interceptors.response.use(
  (response) => response,
  function (error) {
    const originalRequest = error.config;

    // A failed refresh means the session is dead: drop everything and log out.
    if (isRefreshRequest(originalRequest?.url)) {
      isRefreshing = false;
      processQueue(error, null);
      redirectToLogout();

      return Promise.reject(error);
    }

    if (
      401 === error.response?.status &&
      !originalRequest?._retry &&
      !isAuthApiRequest(originalRequest?.url)
    ) {
      const refreshToken = LocalStorage.getRefreshToken();

      if (!refreshToken) {
        redirectToLogout();

        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers = originalRequest.headers ?? {};
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(AxiosInstance(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return refreshSession()
        .then(({ accessToken, refreshToken: nextRefresh }) => {
          authSuccess({ accessToken, refreshToken: nextRefresh });
          processQueue(null, accessToken);
          isRefreshing = false;
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          return AxiosInstance(originalRequest);
        })
        .catch((err) => {
          processQueue(err, null);
          isRefreshing = false;
          redirectToLogout();

          return Promise.reject(err);
        });
    }

    return Promise.reject(error);
  },
);

export default AxiosInstance;
