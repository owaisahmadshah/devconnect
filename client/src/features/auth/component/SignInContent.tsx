import SignInForm from '@/components/organisms/SignInForm';
import type { TSignInUser } from 'shared';
import { useSignIn } from '../hooks/useAuth';
import { getErrorMessage } from '@/lib/errorHanldling';

export const SignInContent = () => {
  const signInMutation = useSignIn();

  const handleSubmit = async (data: TSignInUser) => {
    signInMutation.mutate(data);
  };

  return (
    <div>
      <SignInForm
        onSubmit={handleSubmit}
        isLoading={signInMutation.isPending}
        isError={signInMutation.isError}
        error={getErrorMessage(signInMutation.error)}
      />
    </div>
  );
};
