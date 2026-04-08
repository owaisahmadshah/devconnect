import api from '@/lib/axios';
import type {
  TAuthUserClient,
  TForgetPassword,
  TResendOtp,
  TSignInUser,
  TUniqueIdentifier,
  TVerifyOtp,
} from 'shared';

export const signUpService = async (data: TAuthUserClient) => {
  const response = await api.post('/api/v1/users/signup', data);
  return response.data;
};

export const signInService = async (data: TSignInUser) => {
  const response = await api.post('/api/v1/users/signin', data);
  return response.data;
};

export const signOutService = async () => {
  const response = await api.post('/api/v1/users/signout');
  return response.data;
};

export const verifyOtpService = async (data: TVerifyOtp) => {
  const response = await api.post('/api/v1/users/verify-otp', data);
  return response.data;
};

export const resendOtpService = async (data: TResendOtp) => {
  const response = await api.post('/api/v1/users/resend-otp', data);
  return response.data;
};

export const forgetPasswordService = async (data: TForgetPassword) => {
  const response = await api.post('/api/v1/users/forget-password', data);
  return response.data;
};

export const uniqueIdentifierService = async (data: TUniqueIdentifier) => {
  const response = await api.get(`/unique-identifier/:${data.identifier}`);
  return response.data;
};

export const handleGoogleSignIn = async () => {
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/google`;
};
