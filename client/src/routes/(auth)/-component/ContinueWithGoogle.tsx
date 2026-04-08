import { Chrome } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { handleGoogleSignIn } from '../-services/authService';

const errorMessages: Record<string, string> = {
  invalid_state: 'Authentication failed. Please try again.',
  google_token_failed: 'Failed to connect with Google. Please try again.',
  no_token: 'No response from Google. Please try again.',
  server_error: 'Something went wrong. Please try again.',
};

export const ContinueWithGoogle = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');

    if (error) {
      toast.error(errorMessages[error] ?? 'Google sign-in failed.');
      setTimeout(() => {
        window.history.replaceState({}, '', window.location.pathname);
      }, 500);
    }
  }, []);

  return (
    <Button
      type="button"
      onClick={handleGoogleSignIn}
      className="group text-foreground relative flex h-11 w-full items-center justify-center gap-2 overflow-hidden font-medium shadow-lg transition-all hover:shadow-xl"
    >
      <Chrome className="h-5 w-5 transition-transform group-hover:scale-110" />
      Continue with Google
    </Button>
  );
};
