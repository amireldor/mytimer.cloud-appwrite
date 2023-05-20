import { Component, createEffect, createSignal } from "solid-js";
import { Timer as TimerType } from "../services/appwrite/timers.js";
import { intervalToDuration, isBefore } from "date-fns";
import { formatTime } from "./formatters.js";
import { ConfirmButton } from "./ConfirmButton.jsx";

export interface Props {
  timer: TimerType;
}

const [tick, setTick] = createSignal(0);

createEffect(() => {
  const interval = setInterval(() => {
    setTick(tick() + 1);
  }, 1000);
  return () => clearInterval(interval);
});

export const Timer: Component<Props> = (props) => {
  const calculateDuration = () =>
    intervalToDuration({
      start: new Date(props.timer.timestamp),
      end: new Date(),
    });

  const duration = () => {
    tick(); // for rerendeing
    return calculateDuration();
  };

  const time = () => formatTime(duration());

  const isTimer = !props.timer.countUp;
  const isTimerRunning = () => {
    tick(); // for rerendeing
    return isBefore(new Date(), new Date(props.timer.timestamp));
  };
  const timerCompleted = () => isTimer && !isTimerRunning();

  const timeText = () =>
    timerCompleted() ? `Completed ${time()} ago` : time();

  return (
    <div classList={{ "text-green-500": timerCompleted() }}>
      {props.timer.title?.trim() || "My Timer"} {timeText()}
      <ConfirmButton
        render={(askConfirmation) => {
          return <button onClick={askConfirmation}>❌</button>;
        }}
        renderConfirm={(next) => {
          return (
            <div class="inline-flex flex-wrap gap-2">
              <button class="bg-gray-500" onClick={next}>
                cancel
              </button>
              <button class="bg-red-500" onClick={() => next()}>
                delete timer?
              </button>
            </div>
          );
        }}
      />
    </div>
  );
};
