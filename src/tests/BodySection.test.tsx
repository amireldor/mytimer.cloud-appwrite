import { test, expect, vi } from "vitest";
import { render, screen } from "@solidjs/testing-library";
import { BodySection } from "../components/sections/BodySection";

test("It suggests to add a timer when there are none", () => {
  render(() => <BodySection timers={undefined} onDeleteTimer={null} />);
  expect(screen.queryByText(/Let's add a timer/)).not.toBeNull();
});
