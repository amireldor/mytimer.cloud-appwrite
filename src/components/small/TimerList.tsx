import {
  Component,
  For,
  createEffect,
  createResource,
  createSignal,
} from "solid-js";
import { Timer } from "./Timer.jsx";
import { TimerType, editTimer } from "../../services/appwrite/timers.js";
import { useSession } from "../../services/session.jsx";

export const TimerList: Component<{
  timers: TimerType[];
  onDeleteTimer: ($tid: string) => void;
}> = (props) => {
  const [tick, setTick] = createSignal(0);

  createEffect(() => {
    const interval = setInterval(() => {
      setTick(tick() + 1);
    }, 1000);
    return () => clearInterval(interval);
  });

  return (
    <For each={props.timers}>
      {(timer) => (
        <Timer
          timer={timer}
          tick={tick()}
          onDelete={() => props.onDeleteTimer(timer.$id)}
        />
      )}
    </For>
  );
};
