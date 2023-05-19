import {
  Component,
  For,
  Suspense,
  createResource,
  createSignal,
  onMount,
} from "solid-js";
import { getSessionIdFromURL, startNewSession } from "./services/session.js";
import { Timer, createTimer, listTimers } from "./services/appwrite/timers.js";

export const App: Component = () => {
  const [sessionId, setSessionId] = createSignal<string | null>(null);
  const [timers] = createResource<Timer[], string>(sessionId, async () => {
    if (sessionId()) {
      return await listTimers(sessionId());
    }
    return [];
  });

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
      <Suspense fallback={<span>Loading timers</span>}>
        <For each={timers()}>{(timer) => <span>{timer.id}</span>}</For>
      </Suspense>
    </div>
  );
};
