import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function range(start: number, end: number | undefined, step = 1) {
  let output = [];
  if (typeof end === 'undefined') {
    end = start;
    start = 0;
  }
  for (let i = start; i < end; i += step) {
    output.push(i);
  }
  return output;
}

export function randomPick<T>(array: T[], numItems: number): T[] {
  const shuffled = array.slice().sort(() => Math.random() - 0.5);
  return shuffled.slice(0, numItems);
}
