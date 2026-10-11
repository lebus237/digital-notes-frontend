import {
  callAction,
  ensureApiConfigured,
} from "@digitalnotes/core";

ensureApiConfigured();

export const login = callAction("/api/login", "POST");

export * from "./organisation";
export * from "./courses";
export * from "./employees";
export * from "./notes";
export * from "./users";
