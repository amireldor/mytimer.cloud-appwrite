import { nanoid } from "nanoid";

const SESSION_PARAM_NAME = "session_id";

export function getSessionIdFromURL(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get(SESSION_PARAM_NAME) ?? null;
}

export function startNewSessionId(): string {
  const sessionId = nanoid();
  history.replaceState(null, "", `?${SESSION_PARAM_NAME}=${sessionId}`);
  return sessionId;
}
