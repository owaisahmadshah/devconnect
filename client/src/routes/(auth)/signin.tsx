import { AuthTemplate } from '@/components/templates/AuthTemplate';
import { SignInContent } from '@/features/auth/component/SignInContent';
import { requireLogOut } from '@/lib/requireLoggedOut';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(auth)/signin')({
  component: RouteComponent,
  loader: requireLogOut,
});

function RouteComponent() {
  return (
    <AuthTemplate
      title="Sign in to account"
      subTitle="Join our community of developers and recruiters"
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      footerLinkHref="/signup"
    >
      <SignInContent />
    </AuthTemplate>
  );
}
