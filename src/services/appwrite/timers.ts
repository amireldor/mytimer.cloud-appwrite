import { ID, Query } from "appwrite";
import { client, databases, functions } from "./appwrite.js";

export const TIMERS_DATABASE_ID = import.meta.env
  .VITE_APPWRITE_TIMERS_DATABASE_ID;

export const VITE_CLEAR_TIMERS_FUNCTION_ID = import.meta.env
  .VITE_CLEAR_TIMERS_FUNCTION_ID;

export interface TimerType {
  $id: string;
  title: string;
  timestamp: string;
  countUp: boolean;
}

export async function listTimers(sessionId: string): Promise<TimerType[]> {
  const response = await databases.listDocuments<TimerType[]>(
    TIMERS_DATABASE_ID,
    sessionId,
    [Query.limit(100)]
  );
  return response.documents;
}

export type TimerUpdateStatus = "delete" | "create" | "update";

export function subscribeToTimers(
  sessionId: string,
  // TODO: add types
  cb: (timer: TimerType, status: TimerUpdateStatus) => void
) {
  return client.subscribe(
    `databases.${TIMERS_DATABASE_ID}.collections.${sessionId}.documents`,
    (response: any) => {
      const status: TimerUpdateStatus = response.events.reduce(
        (acc: string, event: string) => {
          if (event.endsWith("create")) {
            return "create";
          }
          if (event.endsWith("update")) {
            return "update";
          }
          if (event.endsWith("delete")) {
            return "delete";
          }
          return acc;
        }
      );

      cb(response.payload, status);
    }
  );
}

export async function createTimer(
  sessionId: string,
  timer: TimerType
): Promise<TimerType> {
  return await databases.createDocument<TimerType>(
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

export async function deleteTimer(sessionId, timerId: string): Promise<void> {
  return await databases.deleteDocument(TIMERS_DATABASE_ID, sessionId, timerId);
}

export async function editTimer(
  sessionId,
  timerId: string,
  timer: Partial<TimerType>
): Promise<void> {
  return await databases.updateDocument(
    TIMERS_DATABASE_ID,
    sessionId,
    timerId,
    timer
  );
}
