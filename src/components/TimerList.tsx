import {
  Component,
  For,
  Suspense,
  children,
  createEffect,
  createSignal,
} from "solid-js";
import { Timer } from "./Timer.jsx";
import { Timer as TimerType } from "../services/appwrite/timers.js";

export const TimerList: Component<{ timers: TimerType[] }> = (props) => {
  const [tick, setTick] = createSignal(0);

  createEffect(() => {
    const interval = setInterval(() => {
      setTick(tick() + 1);
    }, 1000);
    return () => clearInterval(interval);
  });

  return (
    <Suspense fallback={<span>Loading timers</span>}>
      <For each={props.timers}>
        {(timer) => <Timer timer={timer} tick={tick()} />}
      </For>
    </Suspense>
  );
};
