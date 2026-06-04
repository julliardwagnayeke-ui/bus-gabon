import { formatDate, formatTime } from '@/lib/api';

export function formatDateTime(date: string, time: string) {
  return `${formatDate(date)} à ${formatTime(time)}`;
}

export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h${mins > 0 ? `${mins}` : ''}`;
}