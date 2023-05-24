import { test, expect } from "vitest";
import { render, screen } from "@solidjs/testing-library";
import { App } from "../App";

test("Renders App title", () => {
  render(() => <App />);
  expect(screen.queryByText("mytimer.cloud")).not.toBeNull();
});

test("Render getting session", () => {
  render(() => <App />);
  expect(screen.queryByText("Starting your session...")).not.toBeNull();
});
