import type { TResendOtp, TVerifyOtp } from 'shared';
import { getErrorMessage } from '@/lib/errorHanldling';
import VerifyOtpForm from '@/components/organisms/VerifyOtpForm';
import { useResendOtp, useVerifyOtp } from '../hooks/useAuth';

export const VerifyOtpContent = () => {
  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();

  const handleSubmit = async (data: TVerifyOtp) => {
    verifyOtpMutation.mutate(data);
  };

  const handleResendOtp = async (data: TResendOtp) => {
    resendOtpMutation.mutate(data);
  };

  return (
    <div>
      <VerifyOtpForm
        onSubmit={handleSubmit}
        resendOtp={handleResendOtp}
        isLoading={verifyOtpMutation.isPending}
        isError={verifyOtpMutation.isError}
        error={getErrorMessage(verifyOtpMutation.error)}
        isResendLoading={resendOtpMutation.isPending}
        isResendError={resendOtpMutation.isError}
        resendError={getErrorMessage(resendOtpMutation.error)}
      />
    </div>
  );
};
