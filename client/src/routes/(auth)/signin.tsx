import { AuthTemplate } from '@/components/templates/AuthTemplate';
import { requireLogOut } from '@/lib/requireLoggedOut';
import { createFileRoute } from '@tanstack/react-router';
import { SignInContent } from './-component/SignInContent';

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
