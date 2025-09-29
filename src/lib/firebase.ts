import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, enableNetwork } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firestore with better settings
export const db = getFirestore(app);

// Add connection retry logic
let firestoreInitialized = false;

export const initializeFirestoreConnection = async () => {
  if (firestoreInitialized) return;
  
  try {
    // Enable network if it was disabled
    await enableNetwork(db);
    firestoreInitialized = true;
    console.log('Firestore connection established');
  } catch (error) {
    console.warn('Firestore connection issue:', error);
    // Retry connection after a delay
    setTimeout(() => {
      initializeFirestoreConnection();
    }, 5000);
  }
};

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Authentication functions
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  
  // Check if user has profile data in Firestore, if not create it
  const userDocRef = doc(db, 'users', result.user.uid);
  const userDoc = await getDoc(userDocRef);
  
  if (!userDoc.exists()) {
    await setDoc(userDocRef, {
      email: result.user.email,
      displayName: result.user.displayName || result.user.email?.split('@')[0] || 'User',
      photoURL: result.user.photoURL || null, // Use Google profile photo if available
      phoneNumber: '', // Will be required to be filled later
      bio: '',
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    }, { merge: true });
  }
  
  return result;
};

export const signInWithEmail = (email: string, password: string) => 
  signInWithEmailAndPassword(auth, email, password);

export const signUpWithEmail = (email: string, password: string) => 
  createUserWithEmailAndPassword(auth, email, password);

export const signOutUser = () => signOut(auth);

// User data interface
interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  phoneNumber: string;
  bio: string;
  [key: string]: unknown; // For additional Firestore fields
}

// Helper function to format user data with retry logic
export const formatUserData = async (user: User, retryCount = 0): Promise<UserData> => {
  try {
    // Ensure Firestore connection is established
    await initializeFirestoreConnection();
    
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    const firestoreData = userDoc.exists() ? userDoc.data() : {};
    
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      phoneNumber: '',
      bio: '',
      ...firestoreData
    } as UserData;
  } catch (error) {
    console.error('Error fetching user data (attempt ' + (retryCount + 1) + '):', error);
    
    // Retry up to 3 times with exponential backoff
    if (retryCount < 3) {
      const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
      await new Promise(resolve => setTimeout(resolve, delay));
      return formatUserData(user, retryCount + 1);
    }
    
    // Fallback to auth data only if all retries fail
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      phoneNumber: '',
      bio: ''
    } as UserData;
  }
};

export default app; 