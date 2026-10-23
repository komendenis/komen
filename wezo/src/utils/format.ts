export function formatMoney(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatRate(rate: number): string {
  return rate < 1 ? `${Math.round(rate * 100)}¢/min` : `${formatMoney(rate)}/min`;
}

export function formatDuration(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/** Groups local digits in threes for readability: 8031234567 -> 803 123 4567 */
export function formatLocal(digits: string): string {
  if (digits.length <= 4) return digits;
  const head = digits.slice(0, -4).replace(/(\d{3})(?=\d)/g, '$1 ');
  return `${head} ${digits.slice(-4)}`;
}

export function e164(dial: string, digits: string): string {
  return `+${dial}${digits.replace(/^0+/, '')}`;
}

/** Calls are billed per started minute, like most calling cards. */
export function callCost(durationSec: number, rate: number): number {
  if (durationSec <= 0) return 0;
  return Math.ceil(durationSec / 60) * rate;
}

export function formatWhen(ts: number): string {
  const d = new Date(ts);
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return sameDay ? time : `${d.toLocaleDateString()} ${time}`;
}
