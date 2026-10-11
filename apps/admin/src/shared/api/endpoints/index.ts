import { callAction, ensureApiConfigured } from "@digitalnotes/core";

ensureApiConfigured();

export * from "./organisation";
export * from "./courses";
export * from "./employees";
export * from "./notes";
export * from "./users";
export * from "./auth";
