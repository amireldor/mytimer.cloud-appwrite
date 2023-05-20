import {
  Component,
  createResource,
  createSignal,
  onMount,
  useTransition,
} from "solid-js";
import { getSessionIdFromURL, startNewSession } from "./services/session.js";
import {
  Timer as TimerType,
  listTimers,
  createTimer,
} from "./services/appwrite/timers.js";
import { BASE_URL } from "./config.js";
import { TimerList } from "./components/TimerList.jsx";
import { TimerInput } from "./components/TimerInput.jsx";

export const App: Component = () => {
  const [sessionId] = createResource<string>(async () => {
    return getSessionIdFromURL() ?? (await startNewSession());
  });

  const [timers, { mutate }] = createResource<TimerType[], string>(
    sessionId,
    async () => {
      if (sessionId()) {
        return await listTimers(sessionId());
      }
      return [];
    }
  );

  const [pending, start] = useTransition();

  const onCreateTimer = (timer: TimerType) => {
    start(async () => {
      try {
        await createTimer(sessionId(), timer);
        await mutate(timers().concat(timer));
      } catch (error) {
        console.error(error);
        throw error;
      }
    });
  };

  return (
    <div class="text-secondary">
      <a href={BASE_URL} class="text-5xl font-bold text-primary">
        mytimer.cloud
      </a>
      <TimerInput onCreateTimer={onCreateTimer} />
      <TimerList timers={timers()} />
      {pending() && <span>loading...</span>}
    </div>
  );
};
