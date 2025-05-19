// features/auth/hooks/useSignUp.ts
import { useState } from 'react';
// import { useNavigate } from "react-router-dom";
import { authService } from '../services/authService';

interface SignUpData {
  fullName: string;
  email: string;
  password: string;
  accountType: 'developer' | 'recruiter';
}

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const navigate = useNavigate();

  const signUp = async (data: SignUpData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.signUp(data);

      // Store the token
      localStorage.setItem('token', response.token);

      // Redirect based on user type
      if (data.accountType === 'developer') {
        // navigate("/onboarding/developer");
      } else {
        // navigate("/onboarding/recruiter");
      }

      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create account';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithGoogle = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would redirect to Google OAuth
      console.log('Sign up with Google');
      setIsLoading(false);
    } catch (err: any) {
      setError('Google sign up failed');
      setIsLoading(false);
    }
  };

  const signUpWithGithub = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would redirect to GitHub OAuth
      console.log('Sign up with GitHub');
      setIsLoading(false);
    } catch (err: unknown) {
      console.log(err)
      setError('GitHub sign up failed');
      setIsLoading(false);
    }
  };

  return {
    signUp,
    signUpWithGoogle,
    signUpWithGithub,
    isLoading,
    error,
  };
};
