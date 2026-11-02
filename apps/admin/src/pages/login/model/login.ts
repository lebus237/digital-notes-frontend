import {
  login as coreLogin,
  type LoginPayload,
  type LoginResponse,
} from "@digitalnotes/core";
import { queryClient } from "@/shared/api/query-client";

export type { LoginPayload, LoginResponse };

/** App login with the admin query client bound (drops old cache, primes `['me']`). */
export function login(payload: LoginPayload): Promise<LoginResponse> {
  return coreLogin(payload, queryClient);
}
