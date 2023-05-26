import { Meta, StoryObj } from "storybook-solidjs";

import { TimerInput } from "./TimerInput";

const meta = {
  title: "Timer Input",
  component: TimerInput,
  argTypes: {
    onCreateTimer: { action: "create" },
  },
} satisfies Meta<typeof TimerInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
