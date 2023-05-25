import { Component, JSX, createResource } from "solid-js";
import { TimerType, editTimer } from "../../services/appwrite/timers.js";
import { intervalToDuration, isBefore } from "date-fns";
import { formatTime } from "./formatters.js";
import { ConfirmButton } from "./ConfirmButton.jsx";
import { ButtonList } from "./ButtonList.jsx";
import { useSession } from "../../services/session.jsx";

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

  const sessionId = useSession();

  const [edit, { mutate, refetch }] = createResource<
    Partial<TimerType>,
    Partial<TimerType>
  >(
    async (_, info) => {
      if (!info.refetching) {
        return props.timer; // initial value
      }
      const fullTimer = {
        ...edit(),
        ...(info.refetching as Partial<TimerType>),
      };
      const { title, timestamp, countUp } = fullTimer;
      await editTimer(sessionId(), props.timer.$id, {
        title,
        timestamp,
        countUp,
      });
      return fullTimer;
    },
    { initialValue: props.timer }
  );

  const isTimer = !props.timer.countUp;
  const isTimerRunning = () => {
    tick(); // for rerendeing
    return isBefore(new Date(), new Date(props.timer.timestamp));
  };
  const timerCompleted = () => isTimer && !isTimerRunning();

  const timeText = () =>
    timerCompleted() ? `Completed ${time()} ago` : time();

  const onTitleEdit = (event: KeyboardEvent) => {
    const currentTarget = event.currentTarget as HTMLDivElement;
    const resetTitle = () => (currentTarget.textContent = props.timer.title);
    if (event.key === "Escape") {
      resetTitle();
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const content = currentTarget.textContent.trim();
      if (content) {
        mutate({ title: content });
        refetch({ title: content });
      } else {
        resetTitle();
      }
    }
  };

  return (
    <div
      class="transition-colors duration-1000"
      classList={{ "text-success": timerCompleted() }}
    >
      {isTimer && isTimerRunning() && <TimerStatusIcon>⏳</TimerStatusIcon>}
      {isTimer && !isTimerRunning() && <TimerStatusIcon>✅</TimerStatusIcon>}
      {!isTimer && <TimerStatusIcon>⏱</TimerStatusIcon>}{" "}
      <span contentEditable onKeyDown={onTitleEdit}>
        {edit().title?.trim() || "My Timer"}
      </span>{" "}
      {timeText()}
      <ConfirmButton
        render={(askConfirmation) => {
          return (
            <button onClick={askConfirmation} aria-label="Delete timer">
              ❌
            </button>
          );
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
