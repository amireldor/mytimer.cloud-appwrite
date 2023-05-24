import { test, expect, vi } from "vitest";
import { render, screen } from "@solidjs/testing-library";
import { BodySection } from "../components/sections/BodySection";
import { TimerType } from "../services/appwrite/timers";
import userEvent from "@testing-library/user-event";

test("Timer delete callback is called after confirmation", async () => {
  vi.setSystemTime(new Date("2023-01-01"));
  const fn = vi.fn();
  const timer: TimerType = {
    $id: "1",
    title: "test",
    timestamp: new Date(),
    countUp: true,
  };
  render(() => <BodySection timers={[timer]} onDeleteTimer={fn} />);
  await userEvent.click(screen.getByRole("button", { name: "Delete timer" }));
  expect(screen.queryByText("cancel")).not.toBeNull();
  expect(screen.queryByText("delete timer?")).not.toBeNull();
  await userEvent.click(screen.getByText("delete timer?"));
  expect(fn).toHaveBeenCalled();
});
