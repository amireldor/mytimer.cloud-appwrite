import { Component, createEffect, createSignal } from "solid-js";
import { Timer as TimerType } from "../services/appwrite/timers.js";
import { intervalToDuration, isBefore } from "date-fns";

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

  const formatTime = () => {
    const { days, hours, minutes, seconds } = duration();
    return (
      [days, hours, minutes, seconds]
        .reduce((acc, n) => {
          if (acc.length === 0 && n === 0) {
            return acc;
          } else {
            return acc.concat(n);
          }
        }, [])
        .map((n, index) => n.toString().padStart(index !== 0 ? 2 : 0, "0"))
        .join(":") || "0"
    );
  };

  const time = () => formatTime();

  const isTimer = !props.timer.countUp;
  const isTimerRunning = isBefore(new Date(), new Date(props.timer.timestamp));
  const timerCompleted = isTimer && !isTimerRunning;

  const timeText = () => (timerCompleted ? `Completed ${time()} ago` : time());

  return (
    <div>
      {props.timer.title?.trim() || "My Timer"} {timeText()}
    </div>
  );
};
