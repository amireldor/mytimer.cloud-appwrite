import { Component, createSignal, onMount } from "solid-js";
import { getSessionIdFromURL, startNewSession } from "./services/session.js";
import { createTimer } from "./services/appwrite/timers.js";

export const App: Component = () => {
  const [sessionId, setSessionId] = createSignal<string | null>(null);

  onMount(async () => {
    setSessionId(getSessionIdFromURL() ?? (await startNewSession()));
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
