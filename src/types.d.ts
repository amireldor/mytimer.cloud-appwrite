export interface ServiceWorkerMessageEvent extends ExtendableMessageEvent {
  readonly data:
    | {
        type: "skipWaiting";
      }
    | {
        type: "timerCreated";
        timerId: string;
        timestamp: Date;
        title: string;
      }
    | {
        type: "timerDeleted";
        timerId: string;
      };
}
