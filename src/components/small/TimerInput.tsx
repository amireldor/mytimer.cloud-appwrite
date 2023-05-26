import { Component, createSignal } from "solid-js";
import { TimerType } from "../../services/appwrite/timers.js";
import { addSeconds } from "date-fns";
import { ButtonList } from "./ButtonList.jsx";

export const TimerInput: Component<{
  onCreateTimer: (timer: Omit<TimerType, "$id">) => unknown;
}> = (props) => {
  const [value, setValue] = createSignal("");

  const valueToShow = () =>
    value()
      .replace(/[^0-9:]g/, "")
      .split("")
      .reduceRight((acc, curr, index) => {
        const textToAdd = (index > 0 && index % 2 === 0 ? ":" : "") + curr;
        return textToAdd + acc;
      }, "");

  const seconds = () =>
    valueToShow()
      .split(":")
      .reverse()
      .reduce((acc, curr, index) => {
        let multiplier = 1;
        if (index === 1) {
          multiplier = 60;
        } else if (index === 2) {
          multiplier = 60 * 60;
        } else if (index == 3) {
          multiplier = 60 * 60 * 24;
        }
        return acc + Number.parseInt(curr) * multiplier;
      }, 0);

  const startTimerFromInput = () => {
    props.onCreateTimer({
      title: "My Timer",
      timestamp: addSeconds(new Date(), seconds()),
      countUp: false,
    });
    setValue("");
  };

  const onInput = (event) => {
    event.preventDefault();
    // TODO: code can be more readable
    if (event.key === "Enter") {
      startTimerFromInput();
      return;
    }
    if (event.key === "Backspace") {
      setValue(value().slice(0, -1));
      return;
    }
    if (event.key === "Escape") {
      setValue("");
      return;
    }
    if (event.key === ":") {
      if (value().length % 2 === 1) {
        const val = value();
        setValue(val.slice(0, -1) + "0" + val[val.length - 1]);
      }
      return;
    }
    const asNumber = Number.parseInt(event.key);
    if (Number.isNaN(asNumber)) {
      return;
    }
    const split = valueToShow().split(":");
    const colonCount = split.length - 1;
    if (colonCount < 3) {
      setValue(value() + event.key);
    } else {
      const shouldTrim = split[split.length - 1].length === 2;
      setValue(value().slice(shouldTrim ? 1 : 0) + event.key);
    }
  };

  return (
    <>
      <input
        data-testid="timer-input"
        pattern="[0-9:]*"
        placeholder='type "25:00"'
        value={valueToShow()}
        onKeyDown={onInput}
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
