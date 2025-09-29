import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, UserCredential } from 'firebase/auth';
import { auth, signInWithGoogle, signInWithEmail, signUpWithEmail, signOutUser, formatUserData, initializeFirestoreConnection } from '../lib/firebase';

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  phoneNumber: string;
  bio: string;
  [key: string]: unknown;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signInWithGoogle: () => Promise<UserCredential>;
  signInWithEmail: (email: string, password: string) => Promise<UserCredential>;
  signUpWithEmail: (email: string, password: string) => Promise<UserCredential>;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize Firestore connection on app start
  useEffect(() => {
    initializeFirestoreConnection();
  }, []);

  useEffect(() => {
    // Set a timeout to ensure loading doesn't hang indefinitely
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      clearTimeout(loadingTimeout);
      setUser(user);
      if (user) {
        const userData = await formatUserData(user);
        setUserData(userData);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      clearTimeout(loadingTimeout);
    };
  }, []);

  const handleSignInWithGoogle = async () => {
    try {
      const result = await signInWithGoogle();
      return result;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const handleSignInWithEmail = async (email: string, password: string) => {
    try {
      const result = await signInWithEmail(email, password);
      return result;
    } catch (error) {
      console.error('Email sign-in error:', error);
      throw error;
    }
  };

  const handleSignUpWithEmail = async (email: string, password: string) => {
    try {
      const result = await signUpWithEmail(email, password);
      return result;
    } catch (error) {
      console.error('Email sign-up error:', error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Sign-out error:', error);
      throw error;
    }
  };

  const refreshUserData = async () => {
    if (user) {
      try {
        const userData = await formatUserData(user);
        setUserData(userData);
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    }
  };

  const value: AuthContextType = {
    user,
    userData,
    loading,
    signInWithGoogle: handleSignInWithGoogle,
    signInWithEmail: handleSignInWithEmail,
    signUpWithEmail: handleSignUpWithEmail,
    signOut: handleSignOut,
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 