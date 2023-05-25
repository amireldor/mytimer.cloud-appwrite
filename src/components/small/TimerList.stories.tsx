import { Meta, StoryObj } from "storybook-solidjs";
import { TimerList } from "./TimerList";
import { addMinutes } from "date-fns";

const meta = {
  title: "Timer List",
  component: TimerList,
  argTypes: {
    onDeleteTimer: { action: "delete" },
  },
} satisfies Meta<typeof TimerList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const List: Story = {
  render(args) {
    const date = new Date();
    return (
      <TimerList
        onDeleteTimer={args.onDeleteTimer}
        timers={[
          {
            $id: "timer-1",
            title: "My Stopwatch",
            timestamp: date,
            countUp: true,
          },
          {
            $id: "timer-2",
            title: "My Stopwatch",
            timestamp: date,
            countUp: true,
          },
          {
            $id: "timer-3",
            title: "My Timer",
            timestamp: addMinutes(date, 1),
            countUp: false,
          },
        ]}
      />
    );
  },
};
