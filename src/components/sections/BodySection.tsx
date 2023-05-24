import { Component, Suspense, mergeProps } from "solid-js";
import { TimerType, deleteTimer } from "../../services/appwrite/timers";
import { TimerList } from "../small/TimerList";

export interface Props {
  timers: TimerType[] | null;
  onDeleteTimer: ($tid: TimerType["$id"]) => void;
}

export const BodySection: Component<Props> = (props) => {
  const merged = mergeProps({ onDeleteTimer: () => {} }, props);

  return (
    <Suspense fallback={<span>Loading...</span>}>
      <TimerList timers={merged.timers} onDeleteTimer={merged.onDeleteTimer} />
    </Suspense>
  );
};
