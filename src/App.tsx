import {
  Component,
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

  const [timers, setTimers] = createSignal<TimerType[]>([]);

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
        setTimers(timers().concat(timer));
      } else {
        // TODO: fix type so no need to ignore
        // @ts-ignore
        setTimers(timers().filter((t) => t.$id !== timer.$id));
      }
    });
    return () => {
      unsubscribe();
    };
  });

  const [pending, start] = useTransition();

  const onCreateTimer = (timer: TimerType) => {
    start(async () => {
      try {
        await createTimer(sessionId(), timer);
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
      <TimerInput onCreateTimer={onCreateTimer} />
      <TimerList timers={timers()} />
      {pending() && <span>loading...</span>}
    </div>
  );
};
