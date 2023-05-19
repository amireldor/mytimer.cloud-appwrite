import { ID } from "appwrite";
import { databases } from "./appwrite.js";
import { ErrorBoundary } from "solid-js";

export const TIMERS_DATABASE_ID = import.meta.env
  .VITE_APPWRITE_TIMERS_DATABASE_ID;

export interface Timer {
  id: string;
  title: string;
  created: Date;
  stopwatch: boolean;
}

export async function listTimers(sessionId: string) {
  return await databases.listDocuments<Timer[]>(TIMERS_DATABASE_ID, sessionId);
}

export async function createTimer(sessionId: string, timer: Omit<Timer, "id">) {
  return await databases.createDocument<Timer>(
    TIMERS_DATABASE_ID,
    sessionId,
    ID.unique(),
    timer
  );
}
