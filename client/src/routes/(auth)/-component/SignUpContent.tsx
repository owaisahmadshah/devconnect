import SignUpForm from '@/components/organisms/SignUpForm';
import { getErrorMessage } from '@/lib/errorHanldling';
import type { TAuthUserClient } from 'shared';
import { useSignUp } from '../-hooks/useAuth';

export const SignUpContent = () => {
  const signUpMutation = useSignUp();

  const handleSubmit = async (data: TAuthUserClient) => {
    signUpMutation.mutate(data);
  };

  return (
    <div className="grid gap-6">
      <SignUpForm
        onSubmit={handleSubmit}
        isLoading={signUpMutation.isPending}
        error={signUpMutation.isError ? getErrorMessage(signUpMutation.error) : null}
      />
    </div>
  );
};
