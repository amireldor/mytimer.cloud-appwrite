import { ID } from "appwrite";
import { databases, functions } from "./appwrite.js";

export const TIMERS_DATABASE_ID = import.meta.env
  .VITE_APPWRITE_TIMERS_DATABASE_ID;

export const VITE_ENSURE_SESSION_FUNCTION_ID = import.meta.env
  .VITE_ENSURE_SESSION_FUNCTION_ID;

export interface Timer {
  id: string;
  title: string;
}

export async function listTimers(sessionId: string) {
  return await databases.listDocuments<Timer[]>(TIMERS_DATABASE_ID, sessionId, [
    "*",
  ]);
}

export async function createTimer(sessionId: string, timer: Omit<Timer, "id">) {
  return await databases.createDocument<Timer>(
    TIMERS_DATABASE_ID,
    sessionId,
    ID.unique(),
    timer
  );
}

export async function ensureSessionInDatabase(sessionId: string) {
  try {
    const execution = await functions.createExecution(
      VITE_ENSURE_SESSION_FUNCTION_ID,
      JSON.stringify({ sessionId })
    );
    const json = JSON.parse(execution.response);
    if (!json.ok) {
      throw new Error("Failed to ensure session in database");
    }
  } catch (error) {
    console.error(error);
  }
}
