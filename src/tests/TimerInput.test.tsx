import { test, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { addMinutes } from "date-fns";

import { TimerInput } from "../components/small/TimerInput";
import { TimerType } from "../services/appwrite/timers";

beforeAll(() => {
  vi.setSystemTime(new Date("2023-01-01"));
});

test("TimerInput renders the correct placeholder", () => {
  render(() => <TimerInput onCreateTimer={() => {}} />);
  expect(screen.queryByTestId("timer-input")).not.toBeNull();
  expect(screen.queryByText("Add timer")).not.toBeNull();
  expect(screen.queryByText("Add stopwatch")).not.toBeNull();
});

test("TimerInput does not accept non-digits or colon", async () => {
  render(() => <TimerInput onCreateTimer={() => {}} />);
  await userEvent.type(screen.queryByTestId("timer-input"), "Hello my friend");
  expect(screen.queryByTestId("timer-input")).toHaveProperty("value", "");
});

test("TimerInput accepts a digit", async () => {
  render(() => <TimerInput onCreateTimer={() => {}} />);
  await userEvent.type(screen.queryByTestId("timer-input"), "1");
  expect(screen.queryByTestId("timer-input")).toHaveProperty("value", "1");
});

test("TimerInput accepts a digit and colon and adds a leading zero", async () => {
  render(() => <TimerInput onCreateTimer={() => {}} />);
  await userEvent.type(screen.queryByTestId("timer-input"), "1:0");
  expect(screen.queryByTestId("timer-input")).toHaveProperty("value", "01:0");
});

test("TimerInput buttons are disabled on empty input and enabled on input", async () => {
  render(() => <TimerInput onCreateTimer={() => {}} />);
  expect(screen.getByText("Add timer")).toHaveProperty("disabled", true);
  expect(screen.getByText("Add stopwatch")).toHaveProperty("disabled", false);
  await userEvent.type(screen.queryByTestId("timer-input"), "1");
  expect(screen.getByText("Add timer")).toHaveProperty("disabled", false);
  expect(screen.getByText("Add stopwatch")).toHaveProperty("disabled", false);
  await userEvent.type(screen.queryByTestId("timer-input"), "{Escape}");
  expect(screen.getByText("Add timer")).toHaveProperty("disabled", true);
  expect(screen.getByText("Add stopwatch")).toHaveProperty("disabled", false);
});

test("TimerInpupt accepts Enter that clears the input", async () => {
  render(() => <TimerInput onCreateTimer={() => {}} />);
  await userEvent.type(screen.queryByTestId("timer-input"), "1{Enter}");
  expect(screen.queryByTestId("timer-input")).toHaveProperty("value", "");
});

test("TimerInpupt accepts Escape that clears the input", async () => {
  render(() => <TimerInput onCreateTimer={() => {}} />);
  await userEvent.type(screen.queryByTestId("timer-input"), "1{Escape}");
  expect(screen.queryByTestId("timer-input")).toHaveProperty("value", "");
});

test("TimerInpupt accepts Backspace that clears the input", async () => {
  render(() => <TimerInput onCreateTimer={() => {}} />);
  await userEvent.type(screen.queryByTestId("timer-input"), "1{Backspace}");
  expect(screen.queryByTestId("timer-input")).toHaveProperty("value", "");
});

test("TimerInput calls callback with the correct arguments for stopwatch", async () => {
  const fn = vi.fn();
  render(() => <TimerInput onCreateTimer={fn} />);
  await userEvent.click(screen.getByText("Add stopwatch"));
  expect(fn).toHaveBeenCalledWith({
    title: "My Stopwatch",
    timestamp: new Date(),
    countUp: true,
  } as Omit<TimerType, "$id">);
});

test("TimerInput calls callback with the correct arguments for stopwatch", async () => {
  const fn = vi.fn();
  render(() => <TimerInput onCreateTimer={fn} />);
  await userEvent.type(screen.queryByTestId("timer-input"), "5:00");
  expect(screen.queryByTestId("timer-input")).toHaveProperty("value", "05:00");
  await userEvent.click(screen.getByText("Add timer"));
  expect(fn).toHaveBeenCalledWith({
    title: "My Timer",
    timestamp: addMinutes(new Date(), 5),
    countUp: false,
  } as Omit<TimerType, "$id">);
});
