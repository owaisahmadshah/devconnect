import { createFileRoute } from '@tanstack/react-router';

import { VerifyOtpContent } from './-component/VerifyOtpContent';

export const Route = createFileRoute('/(auth)/verify-otp')({
  component: RouteComponent,
});

function RouteComponent() {
  return <VerifyOtpContent />;
}
