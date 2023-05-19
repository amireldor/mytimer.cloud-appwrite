import { functions } from "./appwrite/appwrite.js";

const SESSION_PARAM_NAME = "session_id";

export const VITE_CREATE_SESSION_FUNCTION_ID = import.meta.env
  .VITE_CREATE_SESSION_FUNCTION_ID;

export function getSessionIdFromURL(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get(SESSION_PARAM_NAME) ?? null;
}

export async function createSession(): Promise<string> {
  try {
    const execution = await functions.createExecution(
      VITE_CREATE_SESSION_FUNCTION_ID
    );
    const json = JSON.parse(execution.response);
    if (!json.ok) {
      throw new Error("Failed to create session in database");
    }
    if (!json.sessionId) {
      throw new Error("Did not get a session ID when trying to create session");
    }
    return json.sessionId;
  } catch (error) {
    console.error(error);
  }
}

export async function startNewSession() {
  const sessionId = await createSession();
  if (!sessionId) {
    throw new Error("Failed to start a new session");
  }
  history.replaceState(null, "", `?${SESSION_PARAM_NAME}=${sessionId}`);
  return sessionId;
}