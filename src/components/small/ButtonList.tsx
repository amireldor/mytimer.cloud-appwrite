import { Component, JSX, mergeProps } from "solid-js";

export const ButtonList: Component<{
  inline?: boolean;
  children: JSX.Element;
  class?: string;
}> = (props) => {
  const merged = () =>
    mergeProps({ inline: true, class: "inline-flex gap-2" }, props);
  return (
    <div
      class={`${merged().class}`}
      classList={{ "inline-flex": merged().inline, flex: !merged().inline }}
    >
      {props.children}
    </div>
  );
};
