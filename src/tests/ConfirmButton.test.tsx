import { test, expect, vi } from "vitest";
import { render, screen } from "@solidjs/testing-library";
import { ConfirmButton } from "../components/small/ConfirmButton";
import userEvent from "@testing-library/user-event";

test("ConfirmButton renders and behaves correctly", async () => {
  render(() => (
    <ConfirmButton
      render={(askConfirmation) => (
        <button onClick={askConfirmation}>delete</button>
      )}
      renderConfirm={(next) => (
        <>
          <button onClick={next}>cancel</button>
          <button>confirm</button>
        </>
      )}
    />
  ));

  expect(screen.queryByText("delete")).not.toBeNull();
  await userEvent.click(screen.getByText("delete"));
  expect(screen.queryByText("delete")).toBeNull();
  expect(screen.queryByText("cancel")).not.toBeNull();
  expect(screen.queryByText("confirm")).not.toBeNull();
  await userEvent.click(screen.getByText("cancel"));
  expect(screen.queryByText("delete")).not.toBeNull();
  expect(screen.queryByText("cancel")).toBeNull();
  expect(screen.queryByText("confirm")).toBeNull();
});
