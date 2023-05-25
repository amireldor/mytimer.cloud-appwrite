import { Component, For, createEffect, createSignal } from "solid-js";
import { Timer } from "./Timer.jsx";
import { TimerType } from "../../services/appwrite/timers.js";

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
    <div class="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-4 xl:gap-8">
      <For each={props.timers}>
        {(timer) => (
          <Timer
            timer={timer}
            tick={tick()}
            onDelete={() => props.onDeleteTimer(timer.$id)}
          />
        )}
      </For>
    </div>
  );
};
