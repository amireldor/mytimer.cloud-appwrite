import { beforeAll, vi } from "vitest";

beforeAll(() => {
  // dialog element workaround as per https://github.com/jsdom/jsdom/issues/3294#issuecomment-1196577616
  HTMLDialogElement.prototype.show = vi.fn();
  HTMLDialogElement.prototype.showModal = vi.fn();
  HTMLDialogElement.prototype.close = vi.fn();

  (globalThis.Notification as unknown) = {
    requestPermission: vi.fn(),
    permission: "granted",
  };
});
