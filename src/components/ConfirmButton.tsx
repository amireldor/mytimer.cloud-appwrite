import {
  ChildrenReturn,
  Component,
  JSX,
  children,
  createEffect,
  createSignal,
} from "solid-js";

export const ConfirmButton: Component<{
  render: (askConfirmation: () => void) => JSX.Element;
  renderConfirm: (next: () => void) => JSX.Element;
}> = (props) => {
  const [confirming, setConfirming] = createSignal(false);
  createEffect(() => {
    console.log(confirming());
  });
  return (
    <>
      {confirming()
        ? props.renderConfirm(() => setConfirming(false))
        : props.render(() => setConfirming(true))}
    </>
  );
};
