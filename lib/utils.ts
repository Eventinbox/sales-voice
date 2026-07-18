export function formatTime(date: Date = new Date()): string {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;
  return `${hours}:${minutes} ${ampm}`;
}

export function formatDateTime(date: Date): string {
  const datePart = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  return `${datePart}, ${formatTime(date)}`;
}