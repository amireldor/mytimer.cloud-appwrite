import { ID, Models, Query } from "appwrite";
import { databases } from "./appwrite.js";

export const TIMERS_DATABASE_ID = import.meta.env
  .VITE_APPWRITE_TIMERS_DATABASE_ID;

export interface Timer extends Models.Document {
  title: string;
  timestamp: Date;
  countUp: boolean;
}

export async function listTimers(sessionId: string) {
  const response = await databases.listDocuments<Timer[]>(
    TIMERS_DATABASE_ID,
    sessionId,
    [Query.limit(100)]
  );
  return response.documents;
}

export async function createTimer(sessionId: string, timer: Timer) {
  return await databases.createDocument<Timer>(
    TIMERS_DATABASE_ID,
    sessionId,
    ID.unique(),
    timer
  );
}
