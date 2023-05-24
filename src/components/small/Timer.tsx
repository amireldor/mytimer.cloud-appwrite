import { Component, JSX } from "solid-js";
import { Timer as TimerType } from "../services/appwrite/timers.js";
import { intervalToDuration, isBefore } from "date-fns";
import { formatTime } from "./formatters.js";
import { ConfirmButton } from "./ConfirmButton.jsx";
import { ButtonList } from "./ButtonList.jsx";

export interface Props {
  timer: TimerType;
  tick: number;
  onDelete: () => void;
}

const TimerStatusIcon: Component<{ children: JSX.Element }> = (props) => {
  return <span class="inline-block animate-spin once">{props.children}</span>;
};

export const Timer: Component<Props> = (props) => {
  const tick = () => props.tick;
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
    <div
      class="transition-colors duration-1000"
      classList={{ "text-success": timerCompleted() }}
    >
      {isTimer && isTimerRunning() && <TimerStatusIcon>⏳</TimerStatusIcon>}
      {isTimer && !isTimerRunning() && <TimerStatusIcon>✅</TimerStatusIcon>}
      {!isTimer && <TimerStatusIcon>⏱</TimerStatusIcon>}{" "}
      {props.timer.title?.trim() || "My Timer"} {timeText()}
      <ConfirmButton
        render={(askConfirmation) => {
          return <button onClick={askConfirmation}>❌</button>;
        }}
        renderConfirm={(next) => {
          return (
            <ButtonList>
              <button class="bg-neutral" onClick={next}>
                cancel
              </button>
              <button
                class="bg-error"
                onClick={() => {
                  props.onDelete();
                  next();
                }}
              >
                delete timer?
              </button>
            </ButtonList>
          );
        }}
      />
    </div>
  );
};
