import {
  Component,
  createEffect,
  createResource,
  createSignal,
} from "solid-js";
import {
  SessionContext,
  getSessionIdFromURL,
  startNewSession,
} from "./services/session.js";
import {
  TimerType,
  listTimers,
  createTimer,
  subscribeToTimers,
  deleteTimer,
} from "./services/appwrite/timers.js";
import { BASE_URL } from "./config.js";
import { InputSection } from "./components/sections/InputSection.jsx";
import { BodySection } from "./components/sections/BodySection.jsx";

export const App: Component = () => {
  const [sessionId] = createResource<string>(async () => {
    return getSessionIdFromURL() ?? (await startNewSession());
  });

  const [timers, setTimers] = createSignal<TimerType[]>(null);

  const [firstTimers] = createResource<TimerType[], string>(
    sessionId,
    async () => {
      if (sessionId()) {
        const response = await listTimers(sessionId());
        setTimers(response);
        return response;
      }
      return [];
    }
  );

  createEffect(() => {
    // TODO: add types
    const unsubscribe = subscribeToTimers(sessionId(), (timer, removed) => {
      if (!removed) {
        setTimers(
          timers()
            .filter((t) => !t.$id.startsWith("optimistic-"))
            .concat(timer)
        );
      } else {
        // TODO: fix type so no need to ignore
        setTimers(timers().filter((t) => t.$id !== timer.$id));
      }
    });
    return () => {
      unsubscribe();
    };
  });

  const onCreateTimer = async (timer: TimerType) => {
    try {
      setTimers(
        timers().concat({ ...timer, $id: `optimistic-${Math.random()}` })
      );
      await createTimer(sessionId(), timer);
    } catch (error) {
      setTimers(timers().filter((t) => !t.$id.startsWith("optimistic-")));
      console.error(error);
      throw error;
    }
  };

  const onDeleteTimer = async ($tid) => {
    const index = timers().findIndex((t) => t.$id === $tid);
    const timerToBeDeleted = timers()[index];
    try {
      setTimers(timers().filter((t) => t.$id !== $tid));
      await deleteTimer(sessionId(), $tid);
    } catch (error) {
      const reverted = timers();
      reverted.splice(index, 0, timerToBeDeleted);
      setTimers([...reverted]);
    }
  };

  return (
    <div class="text-secondary">
      <h1 class="text-5xl font-bold text-primary">
        <a href={BASE_URL}>mytimer.cloud</a>
      </h1>
      <SessionContext.Provider value={{ sessionId: sessionId() }}>
        <InputSection onCreateTimer={onCreateTimer} />
        <BodySection
          timers={timers() || firstTimers()}
          onDeleteTimer={onDeleteTimer}
        />
      </SessionContext.Provider>
    </div>
  );
};
