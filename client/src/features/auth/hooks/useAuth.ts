import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import type { TAuthUserClient } from 'shared';
import * as authService from '@/features/auth/services/authService';
import type { AxiosError } from 'axios';

export const useSignUp = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (userData: TAuthUserClient) => authService.signUpService(userData),
    onSuccess: (_, variables) => {
      // variables = userData from mutationFn
      navigate({ to: '/verify-otp', state: { identifier: variables.email } });
      /*
      import { useRouterState } from '@tanstack/react-router';
      const state = useRouterState({ select: s => s.location.state });
      console.log(state); // { identifier: "someone@example.com" }
      */
    },
    onError: (err: AxiosError) => {
      const message = err.response?.data || 'Failed to create account';
      console.log('Error while sign up:', message);
    },
  });
};
