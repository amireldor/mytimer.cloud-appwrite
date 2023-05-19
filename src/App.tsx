import { Component, createSignal, onMount } from "solid-js";
import { getSessionIdFromURL, startNewSession } from "./services/session.js";
import { Timer, createTimer, listTimers } from "./services/appwrite/timers.js";

export const App: Component = () => {
  const [sessionId, setSessionId] = createSignal<string | null>(null);
  const [timers, setTimers] = createSignal<Timer[]>([]);

  onMount(async () => {
    setSessionId(getSessionIdFromURL() ?? (await startNewSession()));
    setTimers(await listTimers(sessionId()));
    console.log("timers", timers());
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
