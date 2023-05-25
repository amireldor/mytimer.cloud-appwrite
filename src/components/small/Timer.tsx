import {
  Component,
  JSX,
  createEffect,
  createResource,
  onCleanup,
  onMount,
} from "solid-js";
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
      if (sessionId?.()) {
        await editTimer(sessionId(), props.timer.$id, {
          title,
          timestamp,
          countUp,
        });
      }
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
    timerCompleted() ? `(completed ${time()} ago)` : time();

  let title: HTMLDivElement;

  const titleProp = () => props.timer.title;

  createEffect(() => {
    if (titleProp().trim().length > 0) {
      resetTitle();
    }
  });

  const resetTitle = () => (title.textContent = titleProp());

  const onTitleEdit = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      resetTitle();
    }
    if (event.key === "Enter") {
      event.preventDefault();
      submitTitleChange();
    }
  };

  const submitTitleChange = () => {
    const content = title.textContent?.trim();
    if (content) {
      mutate({ title: content });
      refetch({ title: content });
    } else {
      title.textContent = props.timer.title;
    }
  };

  return (
    <div
      class="transition-colors duration-1000 border-2 border-primary px-2 py-1 flex items-center rounded"
      classList={{
        "text-success border-success bg-success bg-opacity-10":
          timerCompleted(),
      }}
    >
      <span>
        {isTimer && isTimerRunning() && <TimerStatusIcon>⏳</TimerStatusIcon>}
        {isTimer && !isTimerRunning() && <TimerStatusIcon>✅</TimerStatusIcon>}
        {!isTimer && <TimerStatusIcon>⏱</TimerStatusIcon>}
      </span>
      <span
        class="flex-1 mx-1"
        classList={{ "line-through": timerCompleted() }}
        contentEditable
        onKeyDown={onTitleEdit}
        onBlur={submitTitleChange}
        ref={title}
      >
        {edit().title?.trim() || "My Timer"}
      </span>{" "}
      <span classList={{ "text-xs": timerCompleted() }}>{timeText()}</span>
      <ConfirmButton
        render={(askConfirmation) => {
          return (
            <button onClick={askConfirmation} aria-label="Delete timer">
              ❌
            </button>
          );
        }}
        renderConfirm={(next) => (
          <DeleteConfirmationDialog next={next} onDelete={props.onDelete} />
        )}
      />
    </div>
  );
};

const DeleteConfirmationDialog: Component<{
  next: () => void;
  onDelete: () => void;
}> = (props) => {
  let ref: HTMLDialogElement;
  onMount(() => {
    ref.showModal();
  });
  return (
    <>
      <button aria-label="Delete timer" class="grayscale">
        ❌
      </button>
      <dialog
        ref={ref}
        class="backdrop:bg-gray-500 backdrop:bg-opacity-50 p-4 rounded open:animate-fade-in backdrop:animate-fade-in"
        onClose={() => props.next()}
      >
        <p>Hello. You're about to delete your timer.</p>
        <ButtonList class="flex gap-2 w-full">
          <button
            class="bg-neutral flex-1"
            onClick={() => {
              ref.close();
              props.next();
            }}
          >
            cancel
          </button>
          <button
            class="bg-error flex-1"
            onClick={() => {
              props.onDelete();
              props.next();
            }}
          >
            delete timer?
          </button>
        </ButtonList>
      </dialog>
    </>
  );
};
