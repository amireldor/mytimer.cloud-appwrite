import { Component, For, Suspense, children } from "solid-js";
import { Timer } from "./Timer.jsx";
import { Timer as TimerType } from "../services/appwrite/timers.js";

export const TimerList: Component<{ timers: TimerType[] }> = (props) => {
  return (
    <Suspense fallback={<span>Loading timers</span>}>
      <For each={props.timers}>{(timer) => <Timer timer={timer} />}</For>
    </Suspense>
  );
};
