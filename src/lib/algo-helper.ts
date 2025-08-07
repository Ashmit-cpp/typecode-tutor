import { algorithms } from './algo-text';

export interface AlgorithmResult {
  name: string;
  code: string;
}

export function getRandomAlgorithm(): AlgorithmResult {
  const algorithmKeys = Object.keys(algorithms);
  const randomKey = algorithmKeys[Math.floor(Math.random() * algorithmKeys.length)] as keyof typeof algorithms;
  return {
    name: randomKey,
    code: algorithms[randomKey]
  };
}

export function getAllAlgorithmNames(): string[] {
  return Object.keys(algorithms);
}

export function getAlgorithmByName(name: string): AlgorithmResult {
  return {
    name,
    code: algorithms[name as keyof typeof algorithms] || ''
  };
} 