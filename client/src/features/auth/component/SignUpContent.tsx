import SignUpForm from '@/components/organisms/SignUpForm';
import { useSignUp } from '@/features/auth/hooks/useAuth';
import { getErrorMessage } from '@/lib/errorHanldling';
import type { TAuthUserClient } from 'shared';

export const SignUpContent = () => {
  const signUpMutation = useSignUp();

  const handleSubmit = async (data: TAuthUserClient) => {
    signUpMutation.mutate(data);
  };

  return (
    <div>
      <SignUpForm
        onSubmit={handleSubmit}
        isLoading={signUpMutation.isPending}
        error={signUpMutation.isError ? getErrorMessage(signUpMutation.error) : null}
      />
    </div>
  );
};
