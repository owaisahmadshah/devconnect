import { verifyOtpSchema, type TResendOtp, type TVerifyOtp } from 'shared';
import { Form, FormDescription } from '@/components/ui/form';
import FormField from '@/components/molecules/FormField';
import { SubmitButton } from '@/components/atoms/SubmitButton';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useRouterState } from '@tanstack/react-router';
import { useEffect } from 'react';

interface VerifyOtpProps {
  onSubmit: (data: TVerifyOtp) => Promise<void>;
  resendOtp: (data: TResendOtp) => Promise<void>;
  isLoading: boolean;
  isError: boolean;
  error: string;
  isResendLoading: boolean;
  isResendError: boolean;
  resendError: string;
}

const VerifyOtpForm = ({
  onSubmit,
  resendOtp,
  isLoading,
  isError,
  error,
  isResendLoading,
  isResendError,
  resendError,
}: VerifyOtpProps) => {
  const state = useRouterState({ select: s => s.location.state });

  const form = useForm<TVerifyOtp>({
    defaultValues: {
      otp: '',
    },
    resolver: zodResolver(verifyOtpSchema),
  });

  const handleSubmit = async (data: TVerifyOtp) => {
    await onSubmit(data);
  };

  const handleResendOtp = async () => {
    await resendOtp({ identifier: form.getValues('identifier') });
  };

  useEffect(() => {
    if (!state?.identifier) {
      return;
    }
    form.setValue('identifier', state.identifier);
  }, [state]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 p-6">
        {isError && <p className="text-sm text-red-500">{error}</p>}

        {!form.getValues('identifier') && (
          <FormField
            form={form}
            id="identifier"
            name="identifier"
            labelText="Email or username"
            placeholder="Email or username"
            type="text"
          />
        )}

        <InputOTP maxLength={6} onChange={value => form.setValue('otp', value)}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <FormDescription>Please enter the one-time password sent to your phone.</FormDescription>

        <SubmitButton isLoading={isLoading}>Verify</SubmitButton>
        <Button
          onClick={handleResendOtp}
          variant={'link'}
          className="text-primary cursor-pointer text-sm hover:underline"
        >
          {isResendLoading ? 'Sending...' : 'Resend OTP'}
        </Button>
        {isResendError && <span className="text-xs text-red-600">{resendError}</span>}
      </form>
    </Form>
  );
};

export default VerifyOtpForm;
