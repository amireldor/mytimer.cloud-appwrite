import { Component, JSX, createSignal } from "solid-js";

export const ConfirmButton: Component<{
  render: (askConfirmation: () => void) => JSX.Element;
  renderConfirm: (next: () => void) => JSX.Element;
}> = (props) => {
  const [confirming, setConfirming] = createSignal(false);
  return (
    <>
      {confirming()
        ? props.renderConfirm(() => setConfirming(false))
        : props.render(() => setConfirming(true))}
    </>
  );
};
