// pages/SignUp.tsx
import SignUpForm from '@/components/organisms/SignUpForm';
import { useSignUp } from '@/features/auth/hooks/useAuth';
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
        // error={signUpMutation.error?.response?.data?.message}
      />
    </div>
  );
};
