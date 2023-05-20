import { ID, Models, Query } from "appwrite";
import { client, databases, functions } from "./appwrite.js";

export const TIMERS_DATABASE_ID = import.meta.env
  .VITE_APPWRITE_TIMERS_DATABASE_ID;

export const VITE_CLEAR_TIMERS_FUNCTION_ID = import.meta.env
  .VITE_CLEAR_TIMERS_FUNCTION_ID;

export interface Timer extends Models.Document {
  $id: string;
  title: string;
  timestamp: Date;
  countUp: boolean;
}

export async function listTimers(sessionId: string): Promise<Timer[]> {
  const response = await databases.listDocuments<Timer[]>(
    TIMERS_DATABASE_ID,
    sessionId,
    [Query.limit(100)]
  );
  return response.documents;
}

export function subscribeToTimers(
  sessionId: string,
  // TODO: add types
  cb: (timer: Timer, removed: boolean) => void
) {
  return client.subscribe(
    `databases.${TIMERS_DATABASE_ID}.collections.${sessionId}.documents`,
    (response: any) => {
      const remove = Boolean(
        response.events.find((event: string) => event.endsWith(".delete"))
      );
      cb(response.payload, remove);
    }
  );
}

export async function createTimer(
  sessionId: string,
  timer: Timer
): Promise<Timer> {
  return await databases.createDocument<Timer>(
    TIMERS_DATABASE_ID,
    sessionId,
    ID.unique(),
    timer
  );
}

export async function clearTimers(sessionId: string): Promise<void> {
  const execution = await functions.createExecution(
    VITE_CLEAR_TIMERS_FUNCTION_ID,
    JSON.stringify({ sessionId })
  );
  const json = JSON.parse(execution.response);
  if (!json.ok) {
    throw new Error("Failed to clear timers");
  }
}
