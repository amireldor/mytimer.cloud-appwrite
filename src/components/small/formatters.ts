import { Duration } from "date-fns";

export const formatTime = (duration: Duration) => {
  const { days, hours, minutes, seconds } = duration;
  return (
    [days, hours, minutes, seconds]
      .reduce((acc, n) => {
        if (acc.length === 0 && n === 0) {
          return acc;
        } else {
          return acc.concat(n);
        }
      }, [])
      .map((n, index) => n.toString().padStart(index !== 0 ? 2 : 0, "0"))
      .join(":") || "0"
  );
};
