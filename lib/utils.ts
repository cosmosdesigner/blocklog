
export const calculateDuration = (startDateStr: string, endDateStr?: string) => {
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

  return { days, hours, minutes, totalHours, totalMinutes };
};

export const formatDuration = (duration: { days: number, hours: number, minutes: number }): string => {
  const parts = [];
  if (duration.days > 0) parts.push(`${duration.days}d`);
  if (duration.hours > 0) parts.push(`${duration.hours}h`);
  if (duration.minutes > 0 || parts.length === 0) parts.push(`${duration.minutes}m`);
  return parts.join(' ');
};

export const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
