import { isFirebaseConfigured } from '@/lib/firebase';
import { demoRepo } from './demo';
import type { Repository } from './types';

let cached: Repository | null = null;

/** Returns the active repository. Firebase code is only loaded when configured. */
export async function getRepo(): Promise<Repository> {
  if (cached) return cached;
  if (isFirebaseConfigured) {
    cached = (await import('./firebase')).firebaseRepo;
  } else {
    cached = demoRepo;
  }
  return cached;
}

export type { Repository } from './types';
