import { getFirebaseApp, isFirebaseConfigured } from '@/lib/firebase';

export interface AdminUser {
  email: string | null;
  demo?: boolean;
}

/**
 * Admin auth. With Firebase configured this uses Firebase Authentication
 * (email + password). In demo mode there is no real backend — the admin area only
 * edits data stored in the visitor's own browser, so no sign-in is required.
 */
export function subscribeAdmin(cb: (user: AdminUser | null) => void): () => void {
  if (!isFirebaseConfigured) {
    cb({ email: null, demo: true });
    return () => {};
  }
  let cancelled = false;
  let unsub: () => void = () => {};
  (async () => {
    const { getAuth, onAuthStateChanged } = await import('firebase/auth');
    const auth = getAuth(await getFirebaseApp());
    if (cancelled) return;
    unsub = onAuthStateChanged(auth, (u) => cb(u ? { email: u.email } : null));
    if (cancelled) unsub();
  })();
  return () => {
    cancelled = true;
    unsub();
  };
}

export async function adminSignIn(email: string, password: string): Promise<void> {
  const { getAuth, signInWithEmailAndPassword } = await import('firebase/auth');
  await signInWithEmailAndPassword(getAuth(await getFirebaseApp()), email, password);
}

export async function adminSignOut(): Promise<void> {
  if (!isFirebaseConfigured) return;
  const { getAuth, signOut } = await import('firebase/auth');
  await signOut(getAuth(await getFirebaseApp()));
}
