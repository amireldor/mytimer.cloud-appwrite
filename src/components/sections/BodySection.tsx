import { Component, Suspense, mergeProps } from "solid-js";
import { TimerType, deleteTimer } from "../../services/appwrite/timers";
import { TimerList } from "../small/TimerList";

export interface Props {
  timers: TimerType[] | null;
  onDeleteTimer: ($tid: TimerType["$id"]) => void;
}

export const BodySection: Component<Props> = (props) => {
  const merged = mergeProps({ onDeleteTimer: () => {}, timers: [] }, props);

  return (
    <Suspense fallback={<div>Loading timers...</div>}>
      {merged.timers.length === 0 && (
        <div>
          Let's add a timer :) <div class="inline-block animate-bounce">☝</div>
          ️
        </div>
      )}
      <TimerList timers={merged.timers} onDeleteTimer={merged.onDeleteTimer} />
    </Suspense>
  );
};
