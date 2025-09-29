import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface InlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

const Modal: React.FC<InlineModalProps> = ({ isOpen, onClose, title, subtitle, size = 'md', className = '', children }) => {
  if (!isOpen) return null;

  // Lock body scroll while modal is open
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
  } as const;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`relative w-full ${sizeClasses[size]} mx-4 rounded-2xl overflow-hidden border border-white/10 shadow-2xl ${className}`}
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            {(title || subtitle) && (
              <div className="px-8 pt-8">
                {title && (
                  <h2 className="text-2xl font-bold text-white">{title}</h2>
                )}
                {subtitle && (
                  <p className="mt-2 text-sm text-white/70">{subtitle}</p>
                )}
              </div>
            )}

            {/* Content */}
            {children}

            {/* Close Button (top-right) */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-white">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMethod = 'main' | 'email';

const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const [currentMethod, setCurrentMethod] = useState<AuthMethod>('main');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [mobileForEmail, setMobileForEmail] = useState('');

  // Cleanup effect when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Google sign-in removed

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // No mobile requirement in local auth

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
        setSuccess('Account created successfully!');
      } else {
        await signInWithEmail(email, password);
        setSuccess('Successfully signed in!');
      }
      
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error: any) {
      const errorMessage = error.message || `${isSignUp ? 'Sign up' : 'Sign in'} failed. Please try again.`;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Phone auth removed

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setMobileForEmail('');
    setShowPassword(false);
    setCurrentMethod('main');
    setError('');
    setSuccess('');
    setIsSignUp(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const renderMainOptions = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md space-y-6"
    >

      {/* Email Sign In */}
      <motion.button
        onClick={() => setCurrentMethod('email')}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 bg-orange-500 text-white hover:bg-orange-600 shadow-lg hover:shadow-xl"
      >
        <Mail className="h-6 w-6" />
        <span>Continue with Email</span>
      </motion.button>

      

      {/* Terms and Privacy */}
      <p className="text-sm text-center text-white">
        By continuing, you agree to our{' '}
        <a href="#" className="text-orange-500 hover:text-orange-600 underline">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="text-orange-500 hover:text-orange-600 underline">
          Privacy Policy
        </a>
      </p>
    </motion.div>
  );

  const renderEmailForm = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-md"
    >

      <form onSubmit={handleEmailSignIn} className="space-y-6">
        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium mb-2 text-white">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white border-gray-300 text-gray-900 focus:border-orange-500"
            placeholder="your@email.com"
          />
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-sm font-medium mb-2 text-white">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white border-gray-300 text-gray-900 focus:border-orange-500"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Confirm Password (Sign Up only) */}
        {isSignUp && (
          <div>
            <label className="block text-sm font-medium mb-2 text-white">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white border-gray-300 text-gray-900 focus:border-orange-500"
                placeholder="Confirm your password"
              />
            </div>
          </div>
        )}

        {/* Mobile Number (Sign Up only) */}
        {isSignUp && (
          <div>
            <label className="block text-sm font-medium mb-2 text-white">
              Mobile Number *
            </label>
            <div className="flex">
              <span className="flex items-center px-3 py-3 rounded-l-xl border-2 border-r-0 bg-gray-50 border-gray-300 text-black">
                +91
              </span>
              <input
                type="tel"
                value={mobileForEmail}
                onChange={(e) => setMobileForEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded-r-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white border-gray-300 text-gray-900 focus:border-orange-500"
                placeholder="9876543210"
                maxLength={10}
              />
            </div>
          </div>
        )}

        {/* Forgot Password */}
        {!isSignUp && (
          <div className="text-right">
            <a href="#" className="text-orange-500 hover:text-orange-600 text-sm font-medium">
              Forgot password?
            </a>
          </div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 bg-orange-500 text-white hover:bg-orange-600 shadow-lg hover:shadow-xl ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (isSignUp ? 'Creating Account...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign In')}
        </motion.button>

        {/* Toggle Sign Up/Sign In */}
        <div className="text-center mt-6">
          <p className="text-sm text-white">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-orange-500 hover:text-orange-600 font-medium underline"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </form>
    </motion.div>
  );

  // Mobile form removed

  const getModalTitle = () => {
    switch (currentMethod) {
      case 'email':
        return isSignUp ? 'Create Account' : 'Sign in with Email';
      
      default:
        return 'Welcome to Toura';
    }
  };

  const getModalSubtitle = () => {
    switch (currentMethod) {
      case 'email':
        return isSignUp ? 'Create your new account' : 'Enter your email and password';
      
      default:
        return 'Sign in to start your journey';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={getModalTitle()}
      subtitle={getModalSubtitle()}
      size="md"
      className="bg-gradient-to-br from-gray-900 to-black"
    >
      <div className="p-8">
        {/* Back Button (for sub-forms) */}
        {currentMethod !== 'main' && (
          <motion.button
            onClick={() => setCurrentMethod('main')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mb-6 p-3 rounded-full transition-all duration-300 hover:bg-gray-200/20 flex items-center space-x-2"
          >
            <ArrowLeft className="h-6 w-6 text-white" />
            <span className="text-white text-sm">Back</span>
          </motion.button>
        )}

        {/* Error/Success Messages */}
        <AnimatePresence>
          {(error || success) && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`mb-6 p-4 rounded-xl flex items-center space-x-3 ${
                error 
                  ? 'bg-red-500/20 border border-red-500/30 text-red-400' 
                  : 'bg-green-500/20 border border-green-500/30 text-green-400'
              }`}
            >
              {error ? (
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
              ) : (
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
              )}
              <p className="text-sm font-medium">{error || success}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="flex flex-col items-center w-full">
          <AnimatePresence mode="wait">
            {currentMethod === 'main' && renderMainOptions()}
            {currentMethod === 'email' && renderEmailForm()}
          </AnimatePresence>
        </div>
      </div>
    </Modal>
  );
};

export default SignInModal; 