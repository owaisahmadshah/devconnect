import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import {
  HttpStatus,
  type TAuthUserClient,
  type TResendOtp,
  type TSignInUser,
  type TVerifyOtp,
} from 'shared';
import { getErrorDetails } from '@/lib/errorHanldling';
import * as authService from '../-services/authService';

export const useSignUp = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (userData: TAuthUserClient) => authService.signUpService(userData),
    onSuccess: (_, variables) => {
      navigate({ to: '/verify-otp', state: { identifier: variables.email } });
      // variables = userData from mutationFn
      /*
      import { useRouterState } from '@tanstack/react-router';
      const state = useRouterState({ select: s => s.location.state });
      console.log(state); // { identifier: "someone@example.com" }
      */
    },
  });
};

export const useSignIn = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (userData: TSignInUser) => authService.signInService(userData),
    onSuccess: () => {
      navigate({ to: '/' });
    },
    onError: (error: unknown, variables) => {
      const errDetails = getErrorDetails(error);

      // If user has created account but hasn't verified yet, he will get a new verification code
      if (errDetails.statusCode === HttpStatus.FORBIDDEN) {
        navigate({ to: '/verify-otp', state: { identifier: variables.identifier } });
      }
    },
  });
};

export const useVerifyOtp = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (userData: TVerifyOtp) => authService.verifyOtpService(userData),
    onSuccess: () => {
      navigate({ to: '/signin' });
    },
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: (userData: TResendOtp) => authService.resendOtpService(userData),
  });
};
