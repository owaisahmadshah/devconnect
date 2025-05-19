import { AuthTemplate } from '@/components/templates/AuthTemplate';
import { SignUpContent } from '@/features/auth/component/SignUpContent';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(auth)/signup')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AuthTemplate
      title="Create new account"
      subTitle="Join our community of developers and recruiters"
      footerText="Already have an account?"
      footerLinkText="Sign In"
      footerLinkHref="/signin"
    >
      <SignUpContent />
    </AuthTemplate>
  );
}
