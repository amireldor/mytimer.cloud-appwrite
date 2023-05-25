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
    <ButtonList>
      <TimerInput onCreateTimer={props.onCreateTimer} />
      <ConfirmButton
        render={(confirm) => (
          <button onClick={confirm}>Clear all timers 💀</button>
        )}
        renderConfirm={(next) => (
          <ButtonList>
            <button onClick={next} class="bg-neutral">
              NO!
            </button>
            <button
              onClick={async () => {
                await clearTimers(sessionId());
                next();
              }}
              class="bg-error"
            >
              Make it so
            </button>
          </ButtonList>
        )}
      />
    </ButtonList>
  );
};
