import { algorithms } from './algo-text';

export function getRandomAlgorithm(): string {
  const algorithmKeys = Object.keys(algorithms);
  const randomKey = algorithmKeys[Math.floor(Math.random() * algorithmKeys.length)] as keyof typeof algorithms;
  return algorithms[randomKey];
}

export function getAllAlgorithmNames(): string[] {
  return Object.keys(algorithms);
}

export function getAlgorithmByName(name: string): string {
  return algorithms[name as keyof typeof algorithms] || '';
} 