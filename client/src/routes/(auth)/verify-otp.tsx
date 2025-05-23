import { createFileRoute, useRouterState } from '@tanstack/react-router';

import { AuthTemplate } from '@/components/templates/AuthTemplate';

export const Route = createFileRoute('/(auth)/verify-otp')({
  component: RouteComponent,
});

function RouteComponent() {
  const state = useRouterState({ select: s => s.location.state });

  console.log(state);
  return (
    <AuthTemplate title="Verify OTP">
      <div>
        <h1>Verify OTP</h1>
        <p>Identifier: {state?.identifier}</p>
      </div>
    </AuthTemplate>
  );
}
