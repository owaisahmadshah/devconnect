import NodeCache from 'node-cache';

const stateCache = new NodeCache({ stdTTL: 300 }); // 300s = 5 min

export function saveState(state: string) {
  stateCache.set(state, true);
}

export function validateState(state: string): boolean {
  return Boolean(stateCache.take(state)); // take() consumes the key if exists
}
