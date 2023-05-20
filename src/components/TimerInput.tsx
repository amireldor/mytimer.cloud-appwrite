import { Component, on } from "solid-js";
import { Timer as TimerType } from "../services/appwrite/timers.js";
import { addSeconds } from "date-fns";

export const TimerInput: Component<{
  onClick: (timer: TimerType) => unknown;
}> = (props) => {
  return (
    <div class="flex flex-wrap gap-2">
      <button
        onClick={() =>
          props.onClick({
            countUp: false,
            timestamp: addSeconds(new Date(), 300),
            title: "temp timer lalala",
          })
        }
      >
        temp timer input
      </button>
      <button
        onClick={() => {
          props.onClick({
            countUp: true,
            timestamp: new Date(),
            title: "stopwatch",
          });
        }}
      >
        Add stopwatch
      </button>
    </div>
  );
};
