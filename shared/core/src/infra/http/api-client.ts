import axios from "./axios-client";
import LocalStorage from "../local-storage/LocalStorage";
import { getApiEndpoint } from "../../lib/utils/runtime-config";

export function ensureApiConfigured(): void {
  axios.defaults.baseURL = getApiEndpoint();
  const token = LocalStorage.getAuthToken();
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
}

export function refreshAuthHeader(): void {
  const token = LocalStorage.getAuthToken();
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
}

export function getServerMessage(error: unknown, fallback: string): string {
  if (error !== null && typeof error === "object") {
    const record = error as Record<string, unknown>;
    const response = record.response as
      | {
          data?: {
            message?: unknown;
            errors?: Array<{ message?: unknown } | string>;
          };
          status?: number;
        }
      | undefined;
    const body = response?.data;
    if (typeof body?.message === "string" && body.message.trim() !== "")
      return body.message;
    const first = body?.errors?.[0];
    if (typeof first === "string" && first.trim() !== "") return first;
    if (
      first !== null &&
      typeof first === "object" &&
      typeof first.message === "string" &&
      first.message.trim() !== ""
    ) {
      return first.message;
    }
  }
  if (error instanceof Error && error.message.trim() !== "")
    return error.message;
  return fallback;
}
