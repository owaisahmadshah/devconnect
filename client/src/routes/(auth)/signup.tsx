import { AuthTemplate } from '@/components/templates/AuthTemplate';
import { requireLogOut } from '@/lib/requireLoggedOut';
import { createFileRoute } from '@tanstack/react-router';
import { SignUpContent } from './-component/SignUpContent';

export const Route = createFileRoute('/(auth)/signup')({
  component: RouteComponent,
  loader: requireLogOut,
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
