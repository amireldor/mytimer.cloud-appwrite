import { Meta, StoryObj } from "storybook-solidjs";

import { Timer } from "./Timer";
import { createEffect, createSignal } from "solid-js";
import { addDays, addMinutes, addMonths } from "date-fns";

const meta = {
  title: "Timer",
  component: Timer,
  argTypes: {
    onDelete: { action: "delete" },
  },
} satisfies Meta<typeof Timer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Stopwatch: Story = {
  args: {
    title: "My Stopwatch",
  },
  render(args) {
    const [tick, setTick] = createSignal(0);
    const date = new Date();
    createEffect(() => {
      const interval = setInterval(() => {
        setTick(tick() + 1);
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    });
    return (
      <Timer
        tick={tick()}
        timer={{
          $id: "timer",
          title: args.title,
          timestamp: date,
          countUp: true,
        }}
        onDelete={args.onDelete}
      />
    );
  },
};

export const Countdown: Story = {
  name: "Timer",
  args: {
    title: "My Timer",
  },
  render: (args) => {
    const [tick, setTick] = createSignal(0);
    const date = addMinutes(new Date(), 1);
    createEffect(() => {
      const interval = setInterval(() => {
        setTick(tick() + 1);
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    });
    return (
      <Timer
        tick={tick()}
        timer={{
          $id: "timer",
          title: args.title,
          timestamp: date,
          countUp: false,
        }}
        onDelete={args.onDelete}
      />
    );
  },
};

export const LongCountdown: Story = {
  name: "Long Timer",
  args: {
    title: "My Long Timer",
  },
  render(args) {
    const [tick, setTick] = createSignal(0);
    const date = addMonths(new Date(), 1);
    createEffect(() => {
      const interval = setInterval(() => {
        setTick(tick() + 1);
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    });
    return (
      <Timer
        tick={tick()}
        timer={{
          $id: "timer",
          title: args.title,
          timestamp: date,
          countUp: false,
        }}
        onDelete={args.onDelete}
      />
    );
  },
};
