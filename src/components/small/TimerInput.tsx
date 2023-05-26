import { Component, createSignal, JSX } from "solid-js";
import { TimerType } from "../../services/appwrite/timers.js";
import { addSeconds } from "date-fns";
import { ButtonList } from "./ButtonList.jsx";
import { strToSeconds, secondsToStr } from "./formatters.js";

export const TimerInput: Component<{
  onCreateTimer: (timer: Omit<TimerType, "$id">) => void;
}> = (props) => {
  let form: HTMLFormElement;
  const [rawValue, setRawValue] = createSignal("");
  const valueToShow = () => secondsToStr(strToSeconds(rawValue()));

  const startTimerFromInput = async (raw: string) => {
    props.onCreateTimer({
      title: "My Timer",
      timestamp: addSeconds(new Date(), strToSeconds(raw)),
      countUp: false,
    });
    setRawValue("");
  };

  const onKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (
    event
  ) => {
    const key = event.key;
    if (key == "Enter") {
      event.preventDefault();
      event.currentTarget.blur();
      return;
    }
    if (key == "Backspace") {
      setRawValue(rawValue().slice(0, -1));
      return;
    }
    if (key === "Escape") {
      event.preventDefault();
      setRawValue("");
      return;
    }
    if (key.match(/[^0-9:]/)) {
      return;
    }
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
        enterkeyhint="next"
      />
      <ButtonList inline={false}>
        <button
          class="bg-primary flex-1"
          disabled={!valueToShow()}
          onClick={() => startTimerFromInput(rawValue())}
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
