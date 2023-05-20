import {
  Component,
  Suspense,
  createEffect,
  createResource,
  createSignal,
  useTransition,
} from "solid-js";
import { getSessionIdFromURL, startNewSession } from "./services/session.js";
import {
  Timer as TimerType,
  listTimers,
  createTimer,
  clearTimers,
  subscribeToTimers,
} from "./services/appwrite/timers.js";
import { BASE_URL } from "./config.js";
import { TimerList } from "./components/TimerList.jsx";
import { TimerInput } from "./components/TimerInput.jsx";
import { ConfirmButton } from "./components/ConfirmButton.jsx";
import { ButtonList } from "./components/ButtonList.jsx";

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

  return (
    <div class="text-secondary">
      <h1 class="text-5xl font-bold text-primary">
        <a href={BASE_URL}>mytimer.cloud</a>
      </h1>
      <ButtonList>
        <TimerInput onCreateTimer={onCreateTimer} />
        <ConfirmButton
          render={(confirm) => (
            <button onClick={confirm}>Clear all timers 💀</button>
          )}
          renderConfirm={(next) => (
            <ButtonList>
              <button onClick={next} class="bg-neutral">
                NO!
              </button>
              <button
                onClick={async () => {
                  await clearTimers(sessionId());
                  next();
                }}
                class="bg-error"
              >
                Make it so
              </button>
            </ButtonList>
          )}
        />
      </ButtonList>
      <Suspense fallback={<span>loading timers</span>}>
        <TimerList timers={timers() ?? firstTimers()} />
      </Suspense>
    </div>
  );
};
