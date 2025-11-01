import { createFileRoute } from '@tanstack/react-router';

import { AuthTemplate } from '@/components/templates/AuthTemplate';
import { VerifyOtpContent } from './-component/VerifyOtpContent';

export const Route = createFileRoute('/(auth)/verify-otp')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AuthTemplate title="Verify OTP">
      <VerifyOtpContent />
    </AuthTemplate>
  );
}
