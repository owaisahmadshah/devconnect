import SignInForm from '@/components/organisms/SignInForm';
import { useState } from 'react';
import type { TSignInUser } from 'shared';

export const SignInContent = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: TSignInUser) => {
    console.log(data);
    setIsLoading(prevValue => !prevValue);
  };

  return (
    <div>
      <SignInForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};
