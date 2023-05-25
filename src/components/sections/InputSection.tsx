import { Component, createEffect, useContext } from "solid-js";
import { TimerType, clearTimers } from "../../services/appwrite/timers";
import { ButtonList } from "../small/ButtonList";
import { ConfirmButton } from "../small/ConfirmButton";
import { TimerInput } from "../small/TimerInput";
import { SessionContext, useSession } from "../../services/session";

export interface Props {
  onCreateTimer: (timer: TimerType) => void;
}

export const InputSection: Component<Props> = (props) => {
  const sessionId = useSession();
  return (
    <div class="flex flex-col gap-2 mb-2">
      <TimerInput onCreateTimer={props.onCreateTimer} />
      <ConfirmButton
        render={(confirm) => (
          <button onClick={confirm}>Clear all timers 💀</button>
        )}
        renderConfirm={(next) => (
          <ButtonList class="flex gap-2 w-full">
            <button onClick={next} class="bg-neutral flex-1">
              NO!
            </button>
            <button
              onClick={async () => {
                await clearTimers(sessionId());
                next();
              }}
              class="bg-error flex-2"
            >
              Make it so
            </button>
          </ButtonList>
        )}
      />
    </div>
  );
};
