import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from './firebase';

let recaptchaVerifier: RecaptchaVerifier;

export const initializeRecaptcha = (containerId: string = 'recaptcha-container') => {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        console.log('reCAPTCHA solved');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
      }
    });
  }
  return recaptchaVerifier;
};

export const sendOTP = async (phoneNumber: string): Promise<ConfirmationResult> => {
  try {
    const appVerifier = initializeRecaptcha();
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    return confirmationResult;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

export const verifyOTP = async (confirmationResult: ConfirmationResult, otp: string) => {
  try {
    const result = await confirmationResult.confirm(otp);
    return result;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

export const cleanupRecaptcha = () => {
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
    recaptchaVerifier = null as any;
  }
}; 