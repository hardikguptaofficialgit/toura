// Firebase removed; exporting nulls to avoid breaking imports during transition if any remain
export const auth = null as any;
export const db = null as any;
export const initializeFirestoreConnection = async () => {};
export const signInWithGoogle = async () => { throw new Error('Google sign-in is disabled'); };
export const signInWithEmail = async () => { throw new Error('Firebase email sign-in disabled'); };
export const signUpWithEmail = async () => { throw new Error('Firebase email sign-up disabled'); };
export const signOutUser = async () => {};
export const formatUserData = async () => { return {}; } as any;
export default {} as any;