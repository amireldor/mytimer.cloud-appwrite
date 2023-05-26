export const strToSeconds = (input: string): number | null => {
  const val = input?.replace(/[^0-9:]/g, "") ?? null;
  if (val === null || val.length === 0) return null;

  const parts = val.split(":").reverse();

  const getMultiplier = (index: number): number => {
    switch (index) {
      case 0:
        return 1;
      case 1:
        return 60;
      case 2:
        return 60 * 60;
      case 3:
        return 60 * 60 * 24;
      default:
        return 1;
    }
  };

  const out = parts.reduce((acc, part, index) => {
    const asNumber = Number.parseInt(part, 10);
    if (Number.isNaN(asNumber)) {
      return acc;
    }
    return acc + asNumber * getMultiplier(index);
  }, 0);

  return out;
};

export const secondsToStr = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor(seconds / 3600) % 24;
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [days, hours, minutes, secs]
    .reduce((acc, item) => {
      if (item > 0) {
        return acc.concat(item);
      } else {
        return acc.length > 0 ? acc.concat(0) : [];
      }
    }, [])
    .map((n, index, arr) => n.toString().padStart(2, index > 0 ? "0" : ""));

  return parts.join(":");
};
