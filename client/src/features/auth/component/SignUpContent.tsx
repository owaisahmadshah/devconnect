import SignUpForm from '@/components/organisms/SignUpForm';
import { useState } from 'react';
import type { TAuthUserClient } from 'shared';

export const SignUpContent = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: TAuthUserClient) => {
    console.log(data);
    setIsLoading(prevValue => !prevValue);
  };

  return (
    <div>
      <SignUpForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};
