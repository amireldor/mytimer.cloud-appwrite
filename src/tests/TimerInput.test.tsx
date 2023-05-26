import { it, expect, vi, beforeAll, describe } from "vitest";
import { render, screen } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { addMinutes } from "date-fns";

import { TimerInput } from "../components/small/TimerInput";
import { TimerType } from "../services/appwrite/timers";

beforeAll(() => {
  vi.setSystemTime(new Date("2023-01-01"));
});

describe("TimerInput", () => {
  it("should render the correct placeholder", () => {
    render(() => <TimerInput onCreateTimer={() => {}} />);
    expect(screen.queryByTestId("timer-input")).not.toBeNull();
    expect(screen.queryByText("Add timer")).not.toBeNull();
    expect(screen.queryByText("Add stopwatch")).not.toBeNull();
  });

  it("should not accept non-digits or colon", async () => {
    render(() => <TimerInput onCreateTimer={() => {}} />);
    await userEvent.type(
      screen.queryByTestId("timer-input"),
      "Hello my friend"
    );
    expect(screen.queryByTestId("timer-input")).toHaveProperty("value", "");
  });

  it("should accept a digit", async () => {
    render(() => <TimerInput onCreateTimer={() => {}} />);
    await userEvent.type(screen.queryByTestId("timer-input"), "1");
    expect(screen.queryByTestId("timer-input")).toHaveProperty("value", "1");
  });

  it("should have its buttons disabled on empty input and enabled on input", async () => {
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

  it("should accept Enter that clears the input", async () => {
    render(() => <TimerInput onCreateTimer={() => {}} />);
    await userEvent.type(screen.queryByTestId("timer-input"), "1{Enter}");
    expect(screen.queryByTestId("timer-input")).toHaveProperty("value", "");
  });

  it("should accept Escape that clears the input", async () => {
    render(() => <TimerInput onCreateTimer={() => {}} />);
    await userEvent.type(screen.queryByTestId("timer-input"), "1{Escape}");
    expect(screen.queryByTestId("timer-input")).toHaveProperty("value", "");
  });

  it("should accept Backspace that clears the input", async () => {
    render(() => <TimerInput onCreateTimer={() => {}} />);
    await userEvent.type(screen.queryByTestId("timer-input"), "1{Backspace}");
    expect(screen.queryByTestId("timer-input")).toHaveProperty("value", "");
  });

  it("should call callback with the correct arguments for stopwatch", async () => {
    const fn = vi.fn();
    render(() => <TimerInput onCreateTimer={fn} />);
    await userEvent.click(screen.getByText("Add stopwatch"));
    expect(fn).toHaveBeenCalledWith({
      title: "My Stopwatch",
      timestamp: new Date(),
      countUp: true,
    } as Omit<TimerType, "$id">);
  });

  it("should call callback with the correct arguments for timer", async () => {
    const fn = vi.fn();
    render(() => <TimerInput onCreateTimer={fn} />);
    await userEvent.type(screen.queryByTestId("timer-input"), "5:00");
    expect(screen.queryByTestId("timer-input")).toHaveProperty("value", "5:00");
    await userEvent.click(screen.getByText("Add timer"));
    expect(fn).toHaveBeenCalledWith({
      title: "My Timer",
      timestamp: addMinutes(new Date(), 5),
      countUp: false,
    } as Omit<TimerType, "$id">);
  });
});
