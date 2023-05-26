import { Component, createSignal, JSX } from "solid-js";
import { TimerType } from "../../services/appwrite/timers.js";
import { addSeconds } from "date-fns";
import { ButtonList } from "./ButtonList.jsx";
import { strToSeconds, secondsToStr } from "./formatters.js";

export const TimerInput: Component<{
  onCreateTimer: (timer: Omit<TimerType, "$id">) => unknown;
}> = (props) => {
  const [rawValue, setRawValue] = createSignal("");

  const seconds = () => strToSeconds(rawValue());
  const valueToShow = () => secondsToStr(seconds());

  const startTimerFromInput = () => {
    props.onCreateTimer({
      title: "My Timer",
      timestamp: addSeconds(new Date(), seconds() ?? 0),
      countUp: false,
    });
    setRawValue("");
  };

  const onKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (
    event
  ) => {
    event.preventDefault();
    const key = event.key;
    if (key == "Enter") {
      startTimerFromInput();
      return;
    }
    if (key == "Backspace") {
      setRawValue(rawValue().slice(0, -1));
      return;
    }
    if (key === "Escape") {
      setRawValue("");
      return;
    }
    if (key.match(/[^0-9:]/)) {
      return;
    }
    setRawValue(event.currentTarget.value + event.key);
  };

  const onChange: JSX.EventHandler<HTMLInputElement, Event> = (event) => {
    event.preventDefault();
    setRawValue(event.currentTarget.value);
  };

  return (
    <>
      <input
        data-testid="timer-input"
        pattern="[0-9:]*"
        placeholder='type "25:00"'
        value={rawValue()}
        onKeyDown={onKeyDown}
        onChange={onChange}
        onBlur={() => setRawValue(valueToShow())}
      />
      <ButtonList inline={false}>
        <button
          class="bg-primary flex-1"
          disabled={!valueToShow()}
          onClick={() => startTimerFromInput()}
        >
          Add timer
        </button>
        <button
          class="bg-primary flex-1"
          onClick={() => {
            props.onCreateTimer({
              countUp: true,
              timestamp: new Date(),
              title: "My Stopwatch",
            });
          }}
        >
          Add stopwatch
        </button>
      </ButtonList>
    </>
  );
};
