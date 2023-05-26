import {
  Component,
  Match,
  Switch,
  createEffect,
  createResource,
} from "solid-js";
import {
  SessionProvider,
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

  const [timers, { mutate }] = createResource<TimerType[], string>(
    sessionId,
    async () => {
      if (sessionId()) {
        return await listTimers(sessionId());
      }
      return [];
    }
  );

  createEffect(() => {
    const unsubscribe = subscribeToTimers(sessionId(), (timer, status) => {
      if (status === "create") {
        mutate(
          timers()
            .filter((t) => !t.$id.startsWith("optimistic-"))
            .concat(timer)
        );
      } else if (status === "delete") {
        mutate(timers().filter((t) => t.$id !== timer.$id));
      } else if (status === "update") {
        const index = timers().findIndex((t) => t.$id === timer.$id);
        const updated = timers();
        updated.splice(index, 1, timer);
        mutate([...updated]);
      }
    });
    return () => {
      unsubscribe();
    };
  });

  const onCreateTimer = async (timer: TimerType) => {
    try {
      mutate(timers().concat({ ...timer, $id: `optimistic-${Math.random()}` }));
      await createTimer(sessionId(), timer);
    } catch (error) {
      mutate(timers().filter((t) => !t.$id.startsWith("optimistic-")));
      console.error(error);
      throw error;
    }
  };

  const onDeleteTimer = async ($tid) => {
    const index = timers().findIndex((t) => t.$id === $tid);
    const timerToBeDeleted = timers()[index];
    try {
      mutate(timers().filter((t) => t.$id !== $tid));
      await deleteTimer(sessionId(), $tid);
    } catch (error) {
      const reverted = timers();
      reverted.splice(index, 0, timerToBeDeleted);
      mutate([...reverted]);
    }
  };

  return (
    <div class="text-secondary p-1 md:py-2 md:px-4">
      <h1 class="text-5xl font-bold text-primary mb-4">
        <a href={BASE_URL}>mytimer.cloud</a>
      </h1>
      <SessionProvider>
        <Switch>
          <Match when={sessionId.loading}>
            <div>Starting your session...</div>
          </Match>
          <Match when={sessionId.error}>
            <div>There was some error. Oh no.</div>
          </Match>
          <Match when={!sessionId.loading}>
            <p>
              <mark>
                Your session ID is <strong>{sessionId()}</strong>
              </mark>{" "}
              Please bookmark this page along with your session id to not lose
              it :)
            </p>
            <InputSection onCreateTimer={onCreateTimer} />
            <BodySection timers={timers()} onDeleteTimer={onDeleteTimer} />
          </Match>
        </Switch>
      </SessionProvider>
    </div>
  );
};
