import {
  Component,
  ErrorBoundary,
  Suspense,
  Switch,
  mergeProps,
} from "solid-js";
import { TimerType, deleteTimer } from "../../services/appwrite/timers";
import { TimerList } from "../small/TimerList";
import { BASE_URL } from "../../config";

export interface Props {
  timers: TimerType[] | null;
  onDeleteTimer: ($tid: TimerType["$id"]) => void;
}

export const BodySection: Component<Props> = (props) => {
  const merged = mergeProps({ onDeleteTimer: () => {}, timers: [] }, props);

  return (
    <ErrorBoundary
      fallback={
        <div>
          Some error occurred. Try a <a href={BASE_URL}>new session</a> maybe.
        </div>
      }
    >
      <Suspense fallback={<div>Loading timers...</div>}>
        {merged.timers.length === 0 && (
          <div>
            Let's add a timer :){" "}
            <div class="inline-block animate-bounce">☝</div>️
          </div>
        )}
      </Suspense>
      <TimerList timers={merged.timers} onDeleteTimer={merged.onDeleteTimer} />
    </ErrorBoundary>
  );
};
