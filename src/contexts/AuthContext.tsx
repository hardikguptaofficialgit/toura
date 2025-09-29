import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getSession, signInWithEmail as localSignInWithEmail, signUpWithEmail as localSignUpWithEmail, signOut as localSignOut, formatUserData as localFormatUserData, SessionUser } from '../lib/localAuth';

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
  user: SessionUser | null;
  userData: UserData | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ user: SessionUser }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ user: SessionUser }>;
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
  const [user, setUser] = useState<SessionUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const current = getSession();
    setUser(current);
    const initialize = async () => {
      if (current) {
        const data = await localFormatUserData(current);
        setUserData(data as any);
      }
      setLoading(false);
    };
    initialize();
  }, []);

  const handleSignInWithEmail = async (email: string, password: string) => {
    try {
      const result = await localSignInWithEmail(email, password);
      setUser(result.user);
      const data = await localFormatUserData(result.user);
      setUserData(data as any);
      return result;
    } catch (error) {
      console.error('Email sign-in error:', error);
      throw error;
    }
  };

  const handleSignUpWithEmail = async (email: string, password: string) => {
    try {
      const result = await localSignUpWithEmail(email, password);
      setUser(result.user);
      const data = await localFormatUserData(result.user);
      setUserData(data as any);
      return result;
    } catch (error) {
      console.error('Email sign-up error:', error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await localSignOut();
      setUser(null);
      setUserData(null);
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