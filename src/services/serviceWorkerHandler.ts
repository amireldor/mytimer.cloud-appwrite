import { isBefore } from "date-fns";
import type { ServiceWorkerMessageEvent } from "../types";
import { TimerType } from "./appwrite/timers";

let registration: ServiceWorkerRegistration;

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }
  registration = await navigator.serviceWorker.register("../../serviceWorker", {
    scope: "/",
  });
  if (registration.installing) {
    console.log("Service worker is installing");
  } else if (registration.waiting) {
    console.log("Service worker is waiting");
    registration.waiting.postMessage({
      type: "skipWaiting",
    } as ServiceWorkerMessageEvent["data"]);
  } else if (registration.active) {
    console.log("Service worker is active");
  }
  return registration;
}

export function postTimerCreatedToServiceWorker(timer: TimerType): void {
  if (isBefore(new Date(timer.timestamp), new Date())) {
    return;
  }
  registration.active?.postMessage({
    type: "timerCreated",
    timerId: timer.$id,
    timestamp: new Date(timer.timestamp),
    title: timer.title,
  } as ServiceWorkerMessageEvent["data"]);
}

export function postTimerDeletedToServiceWorker(
  timerId: TimerType["$id"]
): void {
  registration.active?.postMessage({
    type: "timerDeleted",
    timerId,
  } as ServiceWorkerMessageEvent["data"]);
}
