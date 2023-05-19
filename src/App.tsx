import { Component, createSignal, onMount } from "solid-js";
import { getSessionIdFromURL, startNewSessionId } from "./services/session.js";
import {
  createTimer,
  ensureSessionInDatabase,
} from "./services/appwrite/timers.js";

export const App: Component = () => {
  const [sessionId, setSessionId] = createSignal<string | null>(null);

  onMount(() => {
    setSessionId(getSessionIdFromURL() ?? startNewSessionId());
    ensureSessionInDatabase(sessionId());
  });

  return (
    <div>
      <a href="https://mytimer.cloud" class="text-5xl font-bold text-primary">
        mytimer.cloud
      </a>
      <button
        onClick={async () => {
          await createTimer(sessionId(), {
            title: "test timer",
          });
        }}
      >
        clicky
      </button>
    </div>
  );
};
