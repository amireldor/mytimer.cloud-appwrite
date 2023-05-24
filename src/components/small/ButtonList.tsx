import { Component, JSX, mergeProps } from "solid-js";

export const ButtonList: Component<{
  inline?: boolean;
  children: JSX.Element;
}> = (props) => {
  // TODO: is this how you merge props?
  const merged = () => mergeProps({ inline: true }, props);
  return (
    <div
      class={`flex-wrap gap-2`}
      classList={{ "inline-flex": merged().inline, flex: !merged().inline }}
    >
      {props.children}
    </div>
  );
};
