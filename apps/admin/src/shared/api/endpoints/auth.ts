import { callAction } from "@digitalnotes/core";

export const login = callAction("/api/login", "POST");
