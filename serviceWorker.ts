import { ServiceWorkerMessageEvent } from "./src/types";

const timers = new Map<
  string,
  { timestamp: Date; timeoutId: ReturnType<typeof setTimeout>; title: string }
>();

addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

addEventListener("message", (event: ServiceWorkerMessageEvent) => {
  switch (event.data.type) {
    case "skipWaiting": {
      event.waitUntil(skipWaiting());
      break;
    }
    case "timerCreated": {
      handleTimerCreated(event.data.timerId, {
        timestamp: event.data.timestamp,
        title: event.data.title,
      });
      break;
    }
    case "timerDeleted": {
      handleTimerDeleted(event.data.timerId);
    }
  }
});

function handleTimerCreated(
  timerId: string,
  options: { timestamp: Date; title: string }
) {
  const existing = timers.get(timerId);
  let timeoutId: ReturnType<typeof setTimeout>;
  if (existing) {
    timeoutId = existing.timeoutId;
  } else {
    const waitMs = options.timestamp.getTime() - new Date().getTime();
    timeoutId = setTimeout(() => {
      const title = timers.get(timerId)?.title;
      registration.showNotification(title);
    }, waitMs);
  }
  timers.set(timerId, {
    timestamp: options.timestamp,
    title: options.title,
    timeoutId,
  });
}

function handleTimerDeleted(timerId: string) {
  clearInterval(timers.get(timerId)?.timeoutId);
  timers.delete(timerId);
}
