export const calculateDuration = (
  startDateStr: string,
  endDateStr?: string
) => {
  const start = new Date(startDateStr);
  const end = endDateStr ? new Date(endDateStr) : new Date();
  let diff = end.getTime() - start.getTime();

  if (diff < 0) diff = 0;

  const totalMinutes = Math.floor(diff / (1000 * 60));
  const totalHours = diff / (1000 * 60 * 60);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);

  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);

  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * (1000 * 60);

  const seconds = Math.floor(diff / 1000);

  return { days, hours, minutes, seconds, totalHours, totalMinutes };
};

export const formatDuration = (duration: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}): string => {
  const { days, hours, minutes, seconds } = duration;
  const parts = [];

  if (days > 0) {
    parts.push(`${days}d`);
    parts.push(`${hours}h`);
    parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);
  } else if (hours > 0) {
    parts.push(`${hours}h`);
    parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);
  } else if (minutes > 0) {
    parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);
  } else {
    parts.push(`${seconds}s`);
  }
  return parts.join(" ");
};

export const formatTotalDuration = (duration: {
  totalHours: number;
  totalMinutes: number;
}): string => {
  if (duration.totalHours < 1) {
    return `${duration.totalMinutes} total minute${
      duration.totalMinutes !== 1 ? "s" : ""
    }`;
  }
  if (duration.totalHours < 48) {
    const hours = parseFloat(duration.totalHours.toFixed(1));
    return `${hours} total hour${hours !== 1 ? "s" : ""}`;
  }
  const days = parseFloat((duration.totalHours / 24).toFixed(1));
  return `${days} total day${days !== 1 ? "s" : ""}`;
};

export const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const convertTotalHoursToDuration = (totalHours: number) => {
  let totalSeconds = totalHours * 3600;

  if (totalSeconds < 0) totalSeconds = 0;

  const days = Math.floor(totalSeconds / 86400);
  totalSeconds -= days * 86400;

  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds -= hours * 3600;

  const minutes = Math.floor(totalSeconds / 60);
  totalSeconds -= minutes * 60;

  const seconds = Math.floor(totalSeconds);

  return { days, hours, minutes, seconds };
};
